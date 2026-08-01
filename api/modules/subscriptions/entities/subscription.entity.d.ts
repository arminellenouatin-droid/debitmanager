import { Company } from '../../companies/entities/company.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare enum PlanType {
    BASE = "BASE",
    MOYENNE = "MOYENNE",
    SEMESTRIELLE = "SEMESTRIELLE",
    SUPREME = "SUPREME"
}
export declare enum SubscriptionStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    GRACE_PERIOD = "GRACE_PERIOD",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED"
}
export declare class Subscription {
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
}
