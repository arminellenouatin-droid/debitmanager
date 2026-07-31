import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Payment, PaymentStatus, PaymentMethod, PaymentAggregator } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { WebhookDto } from '../dto/webhook.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, tenantId?: string) {
    const { paymentPurpose, referenceId, amount, method, aggregator } = createPaymentDto;

    // Calculate platform commission (1% for card/mobile money)
    let platformCommissionAmount = 0;
    if (method === 'CARD' || method === 'MOBILE_MONEY') {
      const commissionRate = this.configService.get<number>('PLATFORM_COMMISSION_RATE', 1);
      platformCommissionAmount = Math.round((amount * commissionRate) / 100);
    }

    const payment = this.paymentsRepository.create({
      tenantId: tenantId || '',
      paymentPurpose: paymentPurpose as any,
      referenceId,
      amount,
      method: method as any,
      aggregator: aggregator || 'NONE' as any,
      platformCommissionAmount,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // If aggregator is specified, initiate payment
    if (aggregator && aggregator !== 'NONE') {
      return this.initiatePayment(savedPayment.id, createPaymentDto);
    }

    return this.sanitizePayment(savedPayment);
  }

  async findOne(id: string, tenantId?: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id, ...(tenantId && { tenantId }) },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.sanitizePayment(payment);
  }

  async findByReference(referenceId: string, tenantId?: string) {
    const payments = await this.paymentsRepository.find({
      where: { referenceId, ...(tenantId && { tenantId }) },
      order: { createdAt: 'DESC' },
    });

    return payments.map(p => this.sanitizePayment(p));
  }

  async handleWebhook(webhookDto: WebhookDto) {
    const { aggregator, transactionId, status, paymentId } = webhookDto;

    // Verify webhook signature
    const isValid = this.verifyWebhookSignature(aggregator, webhookDto);
    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Find payment
    let payment: Payment;
    
    if (paymentId) {
      payment = await this.paymentsRepository.findOne({
        where: { id: paymentId },
      });
    } else if (transactionId) {
      payment = await this.paymentsRepository.findOne({
        where: { aggregatorReference: transactionId },
      });
    }

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status based on webhook
    const paymentStatus = this.mapAggregatorStatus(status);
    
    await this.paymentsRepository.update(payment.id, {
      status: paymentStatus,
      aggregatorReference: transactionId || payment.aggregatorReference,
      webhookReceivedAt: new Date(),
      reconciled: paymentStatus === PaymentStatus.SUCCESS,
    });

    // If payment is successful, trigger related actions
    if (paymentStatus === PaymentStatus.SUCCESS) {
      await this.onPaymentSuccess(payment);
    }

    return { message: 'Webhook processed successfully' };
  }

  async reconcilePayments(tenantId?: string) {
    const unreconciledPayments = await this.paymentsRepository.find({
      where: {
        ...(tenantId && { tenantId }),
        reconciled: false,
        status: PaymentStatus.SUCCESS,
        aggregator: ['KKIAPAY', 'MONEROO', 'CINETPAY'] as any,
      },
    });

    const results = [];

    for (const payment of unreconciledPayments) {
      try {
        // TODO: Verify payment with aggregator API
        const verified = await this.verifyWithAggregator(payment);
        
        if (verified) {
          await this.paymentsRepository.update(payment.id, {
            reconciled: true,
          });
          results.push({ paymentId: payment.id, status: 'reconciled' });
        } else {
          results.push({ paymentId: payment.id, status: 'verification_failed' });
        }
      } catch (error) {
        results.push({ paymentId: payment.id, status: 'error', error: error.message });
      }
    }

    return { results };
  }

  private async initiatePayment(paymentId: string, paymentDto: CreatePaymentDto) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // TODO: Integrate with aggregator APIs
    switch (payment.aggregator) {
      case PaymentAggregator.KKIAPAY:
        return this.initiateKkiapayPayment(payment, paymentDto);
      case PaymentAggregator.MONEROO:
        return this.initiateMonerooPayment(payment, paymentDto);
      case PaymentAggregator.CINETPAY:
        return this.initiateCinetpayPayment(payment, paymentDto);
      default:
        throw new BadRequestException('Invalid aggregator');
    }
  }

  private async initiateKkiapayPayment(payment: Payment, paymentDto: CreatePaymentDto) {
    // TODO: Implement Kkiapay integration
    const apiKey = this.configService.get<string>('KKIAPAY_API_KEY');
    const publicKey = this.configService.get<string>('KKIAPAY_PUBLIC_KEY');

    return {
      paymentId: payment.id,
      aggregator: 'KKIAPAY',
      paymentUrl: `https://api.kkiapay.me/sandbox/checkout/${payment.id}`,
      amount: payment.amount,
      currency: paymentDto.currency,
    };
  }

  private async initiateMonerooPayment(payment: Payment, paymentDto: CreatePaymentDto) {
    // TODO: Implement Moneroo integration
    const apiKey = this.configService.get<string>('MONEROO_API_KEY');

    return {
      paymentId: payment.id,
      aggregator: 'MONEROO',
      paymentUrl: `https://api.moneroo.com/checkout/${payment.id}`,
      amount: payment.amount,
      currency: paymentDto.currency,
    };
  }

  private async initiateCinetpayPayment(payment: Payment, paymentDto: CreatePaymentDto) {
    // TODO: Implement Cinetpay integration
    const apiKey = this.configService.get<string>('CINETPAY_API_KEY');
    const siteId = this.configService.get<string>('CINETPAY_SITE_ID');

    return {
      paymentId: payment.id,
      aggregator: 'CINETPAY',
      paymentUrl: `https://api.cinetpay.com/checkout/${payment.id}`,
      amount: payment.amount,
      currency: paymentDto.currency,
    };
  }

  private verifyWebhookSignature(aggregator: string, webhookDto: WebhookDto): boolean {
    // TODO: Implement signature verification for each aggregator
    return true;
  }

  private mapAggregatorStatus(aggregatorStatus: string): PaymentStatus {
    // Map aggregator-specific statuses to our PaymentStatus enum
    const statusMap: Record<string, PaymentStatus> = {
      'success': PaymentStatus.SUCCESS,
      'completed': PaymentStatus.SUCCESS,
      'failed': PaymentStatus.FAILED,
      'cancelled': PaymentStatus.FAILED,
      'pending': PaymentStatus.PENDING,
      'processing': PaymentStatus.PENDING,
    };

    return statusMap[aggregatorStatus.toLowerCase()] || PaymentStatus.PENDING;
  }

  private async onPaymentSuccess(payment: Payment) {
    // TODO: Trigger actions based on payment purpose
    switch (payment.paymentPurpose) {
      case 'SUBSCRIPTION':
        // Activate subscription
        break;
      case 'ORDER':
        // Mark order as paid
        break;
      case 'PAYROLL':
        // Mark payroll as paid
        break;
    }
  }

  private async verifyWithAggregator(payment: Payment): Promise<boolean> {
    // TODO: Verify payment status with aggregator API
    return true;
  }

  private sanitizePayment(payment: Payment) {
    const { ...sanitized } = payment;
    return sanitized;
  }
}
