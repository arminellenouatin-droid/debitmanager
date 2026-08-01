import { User } from '../../users/entities/user.entity';
import { ReferralTracking } from './referral-tracking.entity';
import { AffiliateCommission } from './affiliate-commission.entity';
import { AffiliatePayout } from './affiliate-payout.entity';
export declare enum AffiliateStatus {
    PENDING_VALIDATION = "PENDING_VALIDATION",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REJECTED = "REJECTED"
}
export declare enum CommissionMode {
    FIRST_PAYMENT = "FIRST_PAYMENT",
    RECURRING = "RECURRING"
}
export declare enum AffiliatePaymentMethod {
    MOBILE_MONEY = "MOBILE_MONEY",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class Affiliate {
    id: string;
    userId: string;
    tenantId: string;
    referralCode: string;
    referralLink: string;
    paymentMethod: AffiliatePaymentMethod;
    paymentAccountRef: string;
    status: AffiliateStatus;
    commissionRateOverride: number;
    commissionModeOverride: CommissionMode;
    referredBy: string;
    commissionBalance: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    referralTrackings: ReferralTracking[];
    commissions: AffiliateCommission[];
    payouts: AffiliatePayout[];
}
