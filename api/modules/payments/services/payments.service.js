"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const payment_entity_1 = require("../entities/payment.entity");
let PaymentsService = class PaymentsService {
    constructor(paymentsRepository, configService) {
        this.paymentsRepository = paymentsRepository;
        this.configService = configService;
    }
    async create(createPaymentDto, tenantId) {
        const { paymentPurpose, referenceId, amount, method, aggregator } = createPaymentDto;
        let platformCommissionAmount = 0;
        if (method === 'CARD' || method === 'MOBILE_MONEY') {
            const commissionRate = this.configService.get('PLATFORM_COMMISSION_RATE', 1);
            platformCommissionAmount = Math.round((amount * commissionRate) / 100);
        }
        const payment = this.paymentsRepository.create({
            tenantId: tenantId || '',
            paymentPurpose: paymentPurpose,
            referenceId,
            amount,
            method: method,
            aggregator: aggregator || 'NONE',
            platformCommissionAmount,
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        const savedPayment = await this.paymentsRepository.save(payment);
        if (aggregator && aggregator !== 'NONE') {
            return this.initiatePayment(savedPayment.id, createPaymentDto);
        }
        return this.sanitizePayment(savedPayment);
    }
    async findOne(id, tenantId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id, ...(tenantId && { tenantId }) },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.sanitizePayment(payment);
    }
    async findByReference(referenceId, tenantId) {
        const payments = await this.paymentsRepository.find({
            where: { referenceId, ...(tenantId && { tenantId }) },
            order: { createdAt: 'DESC' },
        });
        return payments.map(p => this.sanitizePayment(p));
    }
    async handleWebhook(webhookDto) {
        const { aggregator, transactionId, status, paymentId } = webhookDto;
        const isValid = this.verifyWebhookSignature(aggregator, webhookDto);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        let payment;
        if (paymentId) {
            payment = await this.paymentsRepository.findOne({
                where: { id: paymentId },
            });
        }
        else if (transactionId) {
            payment = await this.paymentsRepository.findOne({
                where: { aggregatorReference: transactionId },
            });
        }
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const paymentStatus = this.mapAggregatorStatus(status);
        await this.paymentsRepository.update(payment.id, {
            status: paymentStatus,
            aggregatorReference: transactionId || payment.aggregatorReference,
            webhookReceivedAt: new Date(),
            reconciled: paymentStatus === payment_entity_1.PaymentStatus.SUCCESS,
        });
        if (paymentStatus === payment_entity_1.PaymentStatus.SUCCESS) {
            await this.onPaymentSuccess(payment);
        }
        return { message: 'Webhook processed successfully' };
    }
    async reconcilePayments(tenantId) {
        const unreconciledPayments = await this.paymentsRepository.find({
            where: {
                ...(tenantId && { tenantId }),
                reconciled: false,
                status: payment_entity_1.PaymentStatus.SUCCESS,
                aggregator: ['KKIAPAY', 'MONEROO', 'CINETPAY'],
            },
        });
        const results = [];
        for (const payment of unreconciledPayments) {
            try {
                const verified = await this.verifyWithAggregator(payment);
                if (verified) {
                    await this.paymentsRepository.update(payment.id, {
                        reconciled: true,
                    });
                    results.push({ paymentId: payment.id, status: 'reconciled' });
                }
                else {
                    results.push({ paymentId: payment.id, status: 'verification_failed' });
                }
            }
            catch (error) {
                results.push({ paymentId: payment.id, status: 'error', error: error.message });
            }
        }
        return { results };
    }
    async initiatePayment(paymentId, paymentDto) {
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        switch (payment.aggregator) {
            case payment_entity_1.PaymentAggregator.KKIAPAY:
                return this.initiateKkiapayPayment(payment, paymentDto);
            case payment_entity_1.PaymentAggregator.MONEROO:
                return this.initiateMonerooPayment(payment, paymentDto);
            case payment_entity_1.PaymentAggregator.CINETPAY:
                return this.initiateCinetpayPayment(payment, paymentDto);
            default:
                throw new common_1.BadRequestException('Invalid aggregator');
        }
    }
    async initiateKkiapayPayment(payment, paymentDto) {
        const apiKey = this.configService.get('KKIAPAY_API_KEY');
        const publicKey = this.configService.get('KKIAPAY_PUBLIC_KEY');
        return {
            paymentId: payment.id,
            aggregator: 'KKIAPAY',
            paymentUrl: `https://api.kkiapay.me/sandbox/checkout/${payment.id}`,
            amount: payment.amount,
            currency: paymentDto.currency,
        };
    }
    async initiateMonerooPayment(payment, paymentDto) {
        const apiKey = this.configService.get('MONEROO_API_KEY');
        return {
            paymentId: payment.id,
            aggregator: 'MONEROO',
            paymentUrl: `https://api.moneroo.com/checkout/${payment.id}`,
            amount: payment.amount,
            currency: paymentDto.currency,
        };
    }
    async initiateCinetpayPayment(payment, paymentDto) {
        const apiKey = this.configService.get('CINETPAY_API_KEY');
        const siteId = this.configService.get('CINETPAY_SITE_ID');
        return {
            paymentId: payment.id,
            aggregator: 'CINETPAY',
            paymentUrl: `https://api.cinetpay.com/checkout/${payment.id}`,
            amount: payment.amount,
            currency: paymentDto.currency,
        };
    }
    verifyWebhookSignature(aggregator, webhookDto) {
        return true;
    }
    mapAggregatorStatus(aggregatorStatus) {
        const statusMap = {
            'success': payment_entity_1.PaymentStatus.SUCCESS,
            'completed': payment_entity_1.PaymentStatus.SUCCESS,
            'failed': payment_entity_1.PaymentStatus.FAILED,
            'cancelled': payment_entity_1.PaymentStatus.FAILED,
            'pending': payment_entity_1.PaymentStatus.PENDING,
            'processing': payment_entity_1.PaymentStatus.PENDING,
        };
        return statusMap[aggregatorStatus.toLowerCase()] || payment_entity_1.PaymentStatus.PENDING;
    }
    async onPaymentSuccess(payment) {
        switch (payment.paymentPurpose) {
            case 'SUBSCRIPTION':
                break;
            case 'ORDER':
                break;
            case 'PAYROLL':
                break;
        }
    }
    async verifyWithAggregator(payment) {
        return true;
    }
    sanitizePayment(payment) {
        const { ...sanitized } = payment;
        return sanitized;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map