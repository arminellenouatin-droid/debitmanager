import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Affiliate, AffiliateStatus } from '../entities/affiliate.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliatesRepository: Repository<Affiliate>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async createAffiliate(userId: string, referralCode: string, tenantId: string) {
    // Check if user already has an affiliate account
    const existing = await this.affiliatesRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('User already has an affiliate account');
    }

    // Find the referrer by code
    const referrer = await this.affiliatesRepository.findOne({
      where: { referralCode, status: AffiliateStatus.ACTIVE },
    });

    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    // Create affiliate account
    const affiliate = this.affiliatesRepository.create({
      userId,
      referralCode: await this.generateReferralCode(),
      referralLink: `https://app.debitmanager.com/ref/${await this.generateReferralCode()}`,
      paymentMethod: 'MOBILE_MONEY' as any,
      paymentAccountRef: '',
      tenantId,
      referredBy: referrer.id,
      commissionBalance: 0,
    });

    return this.affiliatesRepository.save(affiliate);
  }

  async generateReferralCode(): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existing = await this.affiliatesRepository.findOne({
      where: { referralCode: code },
    });

    if (existing) {
      return this.generateReferralCode();
    }

    return code;
  }

  async getAffiliateStats(userId: string) {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate account not found');
    }

    const referrals = await this.affiliatesRepository.find({
      where: { referredBy: affiliate.id },
    });

    const activeReferrals = referrals.filter(r => r.status === AffiliateStatus.ACTIVE).length;

    // Calculate commissions from subscriptions of referred users
    const referredUserIds = referrals.map(r => r.userId);
    const subscriptions = await this.subscriptionsRepository.find({
      where: { companyId: () => `companyId IN ('${referredUserIds.join("','")}')` } as any,
    });

    const totalCommission = subscriptions.reduce((sum, sub) => {
      return sum + (sub.amount * 0.1); // 10% commission
    }, 0);

    return {
      referralCode: affiliate.referralCode,
      totalReferrals: referrals.length,
      activeReferrals,
      totalCommission,
      status: affiliate.status,
    };
  }

  async getReferrals(userId: string) {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate account not found');
    }

    const referrals = await this.affiliatesRepository.find({
      where: { referredBy: affiliate.id },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return referrals;
  }

  async processCommission(subscriptionId: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id: subscriptionId },
      relations: ['company'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Find the affiliate who referred this user
    const affiliate = await this.affiliatesRepository.findOne({
      where: { userId: subscription.company.ownerUserId },
    });

    if (!affiliate || !affiliate.referredBy) {
      return { message: 'No affiliate to credit' };
    }

    // Credit the referrer
    const commission = subscription.amount * 0.1; // 10% commission

    // Get current referrer
    const referrer = await this.affiliatesRepository.findOne({
      where: { id: affiliate.referredBy },
    });

    if (!referrer) {
      return { message: 'Referrer not found' };
    }

    // Update referrer's commission balance
    await this.affiliatesRepository.update(affiliate.referredBy, {
      commissionBalance: referrer.commissionBalance + commission,
    });

    return {
      message: 'Commission processed',
      commission,
      referrerId: affiliate.referredBy,
    };
  }

  async withdrawCommission(userId: string, amount: number) {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate account not found');
    }

    if (affiliate.commissionBalance < amount) {
      throw new BadRequestException('Insufficient commission balance');
    }

    await this.affiliatesRepository.update(affiliate.id, {
      commissionBalance: affiliate.commissionBalance - amount,
    });

    return {
      message: 'Withdrawal processed',
      amount,
      remainingBalance: affiliate.commissionBalance - amount,
    };
  }
}
