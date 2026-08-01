import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus, PaymentMethod, PaymentAggregator } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { WebhookDto } from '../dto/webhook.dto';
export declare class PaymentsService {
    private paymentsRepository;
    private configService;
    constructor(paymentsRepository: Repository<Payment>, configService: ConfigService);
    create(createPaymentDto: CreatePaymentDto, tenantId?: string): Promise<{
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
        method: PaymentMethod;
        aggregator: PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        paymentPurpose: import("../entities/payment.entity").PaymentPurpose;
        referenceId: string;
        amount: number;
        method: PaymentMethod;
        aggregator: PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByReference(referenceId: string, tenantId?: string): Promise<{
        id: string;
        tenantId: string;
        paymentPurpose: import("../entities/payment.entity").PaymentPurpose;
        referenceId: string;
        amount: number;
        method: PaymentMethod;
        aggregator: PaymentAggregator;
        aggregatorReference: string;
        platformCommissionAmount: number;
        status: PaymentStatus;
        webhookReceivedAt: Date;
        reconciled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    handleWebhook(webhookDto: WebhookDto): Promise<{
        message: string;
    }>;
    reconcilePayments(tenantId?: string): Promise<{
        results: any[];
    }>;
    private initiatePayment;
    private initiateKkiapayPayment;
    private initiateMonerooPayment;
    private initiateCinetpayPayment;
    private verifyWebhookSignature;
    private mapAggregatorStatus;
    private onPaymentSuccess;
    private verifyWithAggregator;
    private sanitizePayment;
}
