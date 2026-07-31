import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Subscription, PlanType, SubscriptionStatus } from '../entities/subscription.entity';
import { Company, ActivityType, CompanyStatus } from '../../companies/entities/company.entity';
import { Payment, PaymentStatus, PaymentMethod, PaymentAggregator } from '../../payments/entities/payment.entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ChangePlanDto } from '../dto/change-plan.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { plan, companyId, amount, currency, paymentMethod, aggregator } = createSubscriptionDto;

    // Get company
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Calculate period based on plan
    const { periodStart, periodEnd } = this.calculatePeriod(plan);

    // Create payment record
    const payment = this.paymentsRepository.create({
      tenantId: company.tenantId,
      paymentPurpose: 'SUBSCRIPTION' as any,
      referenceId: companyId, // Will be updated after subscription creation
      amount,
      method: paymentMethod || 'CASH' as any,
      aggregator: aggregator || 'NONE' as any,
      platformCommissionAmount: 0, // No commission on subscription payments
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Create subscription
    const subscription = this.subscriptionsRepository.create({
      tenantId: company.tenantId,
      plan: plan as any,
      activityCoefficient: company.activityCoefficient,
      amount,
      currency,
      periodStart,
      periodEnd,
      status: SubscriptionStatus.PENDING,
      paymentId: savedPayment.id,
      autoRenew: false,
    });

    const savedSubscription = await this.subscriptionsRepository.save(subscription);

    // Update payment reference
    await this.paymentsRepository.update(savedPayment.id, {
      referenceId: savedSubscription.id,
    });

    // If cash payment, activate immediately
    if (paymentMethod === 'CASH') {
      await this.activateSubscription(savedSubscription.id);
    }

    return {
      subscription: this.sanitizeSubscription(savedSubscription),
      payment: savedPayment,
    };
  }

  async findOne(id: string, tenantId: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id, tenantId },
      relations: ['payment'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.sanitizeSubscription(subscription);
  }

  async findByCompany(companyId: string, tenantId: string) {
    const subscriptions = await this.subscriptionsRepository.find({
      where: { tenantId },
      relations: ['payment'],
      order: { createdAt: 'DESC' },
    });

    return subscriptions.map(s => this.sanitizeSubscription(s));
  }

  async changePlan(id: string, changePlanDto: ChangePlanDto, tenantId: string) {
    const { newPlan } = changePlanDto;

    const subscription = await this.findOne(id, tenantId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Can only change plan for active subscriptions');
    }

    // Calculate prorated amount
    const proratedAmount = this.calculateProratedAmount(subscription, newPlan);

    // Create new subscription
    const { periodStart, periodEnd } = this.calculatePeriod(newPlan);

    const newSubscription = this.subscriptionsRepository.create({
      tenantId: subscription.tenantId,
      plan: newPlan as any,
      activityCoefficient: subscription.activityCoefficient,
      amount: proratedAmount,
      currency: subscription.currency,
      periodStart,
      periodEnd,
      status: SubscriptionStatus.PENDING,
      autoRenew: subscription.autoRenew,
    });

    const savedNewSubscription = await this.subscriptionsRepository.save(newSubscription);

    return this.sanitizeSubscription(savedNewSubscription);
  }

  async startTrial(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const trialDays = this.configService.get<number>('TRIAL_PERIOD_DAYS', 14);
    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    await this.companiesRepository.update(companyId, {
      status: CompanyStatus.TRIAL,
      trialEndsAt,
    });

    return {
      message: 'Trial started successfully',
      trialEndsAt,
    };
  }

  async activateSubscription(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.subscriptionsRepository.update(id, {
      status: SubscriptionStatus.ACTIVE,
    });

    // Update company status
    await this.companiesRepository.update(subscription.tenantId, {
      status: CompanyStatus.ACTIVE,
    });

    return { message: 'Subscription activated successfully' };
  }

  async getPlans() {
    const basePricing = {
      BASE: { monthly: 50000, quarterly: 130000, semiannual: 240000, annual: 400000 },
      MOYENNE: { monthly: 75000, quarterly: 195000, semiannual: 360000, annual: 600000 },
      SEMESTRIELLE: { monthly: 100000, quarterly: 260000, semiannual: 480000, annual: 800000 },
      SUPREME: { monthly: 150000, quarterly: 390000, semiannual: 720000, annual: 1200000 },
    };

    return {
      currency: 'XOF',
      plans: basePricing,
    };
  }

  private calculatePeriod(plan: string) {
    const now = new Date();
    let periodEnd: Date;

    switch (plan) {
      case 'BASE':
        periodEnd = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case 'MOYENNE':
        periodEnd = new Date(now.setMonth(now.getMonth() + 3));
        break;
      case 'SEMESTRIELLE':
        periodEnd = new Date(now.setMonth(now.getMonth() + 6));
        break;
      case 'SUPREME':
        periodEnd = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      default:
        periodEnd = new Date(now.setMonth(now.getMonth() + 1));
    }

    return { periodStart: new Date(), periodEnd };
  }

  private calculateProratedAmount(subscription: Subscription, newPlan: string): number {
    // Simple prorata calculation based on remaining days
    const now = new Date();
    const remainingDays = Math.ceil((subscription.periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((subscription.periodEnd.getTime() - subscription.periodStart.getTime()) / (1000 * 60 * 60 * 24));

    const baseAmount = this.getBaseAmount(newPlan);
    const proratedAmount = Math.round((baseAmount * remainingDays) / totalDays);

    return proratedAmount;
  }

  private getBaseAmount(plan: string): number {
    const basePricing: Record<string, number> = {
      BASE: 50000,
      MOYENNE: 75000,
      SEMESTRIELLE: 100000,
      SUPREME: 150000,
    };

    return basePricing[plan] || 50000;
  }

  private sanitizeSubscription(subscription: Subscription) {
    const { ...sanitized } = subscription;
    return sanitized;
  }
}
