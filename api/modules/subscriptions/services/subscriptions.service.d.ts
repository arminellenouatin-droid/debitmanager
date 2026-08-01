import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Subscription, PlanType, SubscriptionStatus } from '../entities/subscription.entity';
import { Company } from '../../companies/entities/company.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ChangePlanDto } from '../dto/change-plan.dto';
export declare class SubscriptionsService {
    private subscriptionsRepository;
    private companiesRepository;
    private paymentsRepository;
    private configService;
    constructor(subscriptionsRepository: Repository<Subscription>, companiesRepository: Repository<Company>, paymentsRepository: Repository<Payment>, configService: ConfigService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        subscription: {
            id: string;
            tenantId: string;
            plan: PlanType;
            activityCoefficient: number;
            amount: number;
            currency: string;
            periodStart: Date;
            periodEnd: Date;
            status: SubscriptionStatus;
            paymentId: string;
            autoRenew: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: Company;
            payment?: Payment;
        };
        payment: Payment;
    }>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: Company;
        payment?: Payment;
    }>;
    findByCompany(companyId: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: Company;
        payment?: Payment;
    }[]>;
    changePlan(id: string, changePlanDto: ChangePlanDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: Company;
        payment?: Payment;
    }>;
    startTrial(companyId: string): Promise<{
        message: string;
        trialEndsAt: Date;
    }>;
    activateSubscription(id: string): Promise<{
        message: string;
    }>;
    getPlans(): Promise<{
        currency: string;
        plans: {
            BASE: {
                monthly: number;
                quarterly: number;
                semiannual: number;
                annual: number;
            };
            MOYENNE: {
                monthly: number;
                quarterly: number;
                semiannual: number;
                annual: number;
            };
            SEMESTRIELLE: {
                monthly: number;
                quarterly: number;
                semiannual: number;
                annual: number;
            };
            SUPREME: {
                monthly: number;
                quarterly: number;
                semiannual: number;
                annual: number;
            };
        };
    }>;
    private calculatePeriod;
    private calculateProratedAmount;
    private getBaseAmount;
    private sanitizeSubscription;
}
