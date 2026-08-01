import { Affiliate } from './affiliate.entity';
export declare enum PayoutStatus {
    REQUESTED = "REQUESTED",
    PROCESSING = "PROCESSING",
    PAID = "PAID",
    REJECTED = "REJECTED"
}
export declare class AffiliatePayout {
    id: string;
    affiliateId: string;
    amount: number;
    periodStart: Date;
    periodEnd: Date;
    status: PayoutStatus;
    paymentReference: string;
    processedByUserId: string;
    createdAt: Date;
    updatedAt: Date;
    affiliate: Affiliate;
}
