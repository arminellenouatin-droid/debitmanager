import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { WebhookDto } from '../dto/webhook.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto, tenantId: string): Promise<{
        paymentId: string;
        aggregator: string;
        paymentUrl: string;
        amount: number;
        currency: string;
    } | {
        id: string;
        tenantId: string;
        paymentPurpose: import("../entities/payment.entity").PaymentPurpose;
        referenceId: string;
        amount: number;
        method: import("../entities/payment.entity").PaymentMethod;
        aggregator: import("../entities/payment.entity").PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: import("../entities/payment.entity").PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        paymentPurpose: import("../entities/payment.entity").PaymentPurpose;
        referenceId: string;
        amount: number;
        method: import("../entities/payment.entity").PaymentMethod;
        aggregator: import("../entities/payment.entity").PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: import("../entities/payment.entity").PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByReference(referenceId: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        paymentPurpose: import("../entities/payment.entity").PaymentPurpose;
        referenceId: string;
        amount: number;
        method: import("../entities/payment.entity").PaymentMethod;
        aggregator: import("../entities/payment.entity").PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: import("../entities/payment.entity").PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    handleWebhook(aggregator: string, webhookDto: WebhookDto): Promise<{
        message: string;
    }>;
    reconcile(tenantId: string): Promise<{
        results: any[];
    }>;
}
