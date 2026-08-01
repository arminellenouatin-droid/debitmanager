import { Repository } from 'typeorm';
import { Affiliate, AffiliateStatus } from '../entities/affiliate.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare class AffiliatesService {
    private affiliatesRepository;
    private companiesRepository;
    private subscriptionsRepository;
    constructor(affiliatesRepository: Repository<Affiliate>, companiesRepository: Repository<Company>, subscriptionsRepository: Repository<Subscription>);
    createAffiliate(userId: string, referralCode: string, tenantId: string): Promise<Affiliate>;
    generateReferralCode(): Promise<string>;
    getAffiliateStats(userId: string): Promise<{
        referralCode: string;
        totalReferrals: number;
        activeReferrals: number;
        totalCommission: number;
        status: AffiliateStatus;
    }>;
    getReferrals(userId: string): Promise<Affiliate[]>;
    processCommission(subscriptionId: string): Promise<{
        message: string;
        commission?: undefined;
        referrerId?: undefined;
    } | {
        message: string;
        commission: number;
        referrerId: string;
    }>;
    withdrawCommission(userId: string, amount: number): Promise<{
        message: string;
        amount: number;
        remainingBalance: number;
    }>;
}
