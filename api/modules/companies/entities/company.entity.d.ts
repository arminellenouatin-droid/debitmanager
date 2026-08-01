import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare enum ActivityType {
    BUVETTE = "BUVETTE",
    BAR_RESTAURANT = "BAR_RESTAURANT",
    NIGHTCLUB_LOUNGE = "NIGHTCLUB_LOUNGE"
}
export declare enum CompanyStatus {
    TRIAL = "TRIAL",
    ACTIVE = "ACTIVE",
    GRACE_PERIOD = "GRACE_PERIOD",
    SUSPENDED = "SUSPENDED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare class Company {
    id: string;
    tenantId: string;
    name: string;
    activityType: ActivityType;
    uniqueCode: string;
    country: string;
    currency: string;
    language: string;
    logoUrl: string;
    address: string;
    status: CompanyStatus;
    trialEndsAt: Date;
    ownerUserId: string;
    affiliateId: string;
    referralTrackingId: string;
    activityCoefficient: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    owner: User;
    subscriptions: Subscription[];
}
