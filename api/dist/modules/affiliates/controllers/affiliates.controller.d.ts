import { AffiliatesService } from '../services/affiliates.service';
export declare class AffiliatesController {
    private readonly affiliatesService;
    constructor(affiliatesService: AffiliatesService);
    join(body: {
        referralCode: string;
    }, userId: string, tenantId: string): Promise<import("../entities/affiliate.entity").Affiliate>;
    getStats(userId: string): Promise<{
        referralCode: string;
        totalReferrals: number;
        activeReferrals: number;
        totalCommission: number;
        status: import("../entities/affiliate.entity").AffiliateStatus;
    }>;
    getReferrals(userId: string): Promise<import("../entities/affiliate.entity").Affiliate[]>;
    withdraw(body: {
        amount: number;
    }, userId: string): Promise<{
        message: string;
        amount: number;
        remainingBalance: number;
    }>;
}
