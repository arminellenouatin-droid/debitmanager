import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ChangePlanDto } from '../dto/change-plan.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        subscription: {
            id: string;
            tenantId: string;
            plan: import("../entities/subscription.entity").PlanType;
            activityCoefficient: number;
            amount: number;
            currency: string;
            periodStart: Date;
            periodEnd: Date;
            status: import("../entities/subscription.entity").SubscriptionStatus;
            paymentId: string;
            autoRenew: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: import("../../companies/entities/company.entity").Company;
            payment?: import("../../payments/entities/payment.entity").Payment;
        };
        payment: import("../../payments/entities/payment.entity").Payment;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: import("../entities/subscription.entity").PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: import("../entities/subscription.entity").SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: import("../../companies/entities/company.entity").Company;
        payment?: import("../../payments/entities/payment.entity").Payment;
    }[]>;
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
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: import("../entities/subscription.entity").PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: import("../entities/subscription.entity").SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: import("../../companies/entities/company.entity").Company;
        payment?: import("../../payments/entities/payment.entity").Payment;
    }>;
    startTrial(body: {
        companyId: string;
    }): Promise<{
        message: string;
        trialEndsAt: Date;
    }>;
    changePlan(id: string, changePlanDto: ChangePlanDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        plan: import("../entities/subscription.entity").PlanType;
        activityCoefficient: number;
        amount: number;
        currency: string;
        periodStart: Date;
        periodEnd: Date;
        status: import("../entities/subscription.entity").SubscriptionStatus;
        paymentId: string;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
        company: import("../../companies/entities/company.entity").Company;
        payment?: import("../../payments/entities/payment.entity").Payment;
    }>;
}
