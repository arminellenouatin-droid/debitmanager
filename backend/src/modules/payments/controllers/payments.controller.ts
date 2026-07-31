import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { PaymentsService } from '../services/payments.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { WebhookDto } from '../dto/webhook.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPaymentDto: CreatePaymentDto, @TenantId() tenantId: string) {
    return this.paymentsService.create(createPaymentDto, tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.paymentsService.findOne(id, tenantId);
  }

  @Get('reference/:referenceId')
  @UseGuards(JwtAuthGuard)
  async findByReference(@Param('referenceId') referenceId: string, @TenantId() tenantId: string) {
    return this.paymentsService.findByReference(referenceId, tenantId);
  }

  @Post('webhook/:aggregator')
  @Public()
  async handleWebhook(@Param('aggregator') aggregator: string, @Body() webhookDto: WebhookDto) {
    return this.paymentsService.handleWebhook({ ...webhookDto, aggregator });
  }

  @Post('reconcile')
  @UseGuards(JwtAuthGuard)
  async reconcile(@TenantId() tenantId: string) {
    return this.paymentsService.reconcilePayments(tenantId);
  }
}
