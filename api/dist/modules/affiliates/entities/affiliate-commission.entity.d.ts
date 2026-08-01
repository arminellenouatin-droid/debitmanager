import { Affiliate } from './affiliate.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare enum CommissionStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    PAID = "PAID",
    REJECTED = "REJECTED"
}
export declare class AffiliateCommission {
    id: string;
    affiliateId: string;
    companyId: string;
    subscriptionId: string;
    amount: number;
    status: CommissionStatus;
    validatedAt: Date;
    createdAt: Date;
    affiliate: Affiliate;
    company: Company;
    subscription: Subscription;
}
