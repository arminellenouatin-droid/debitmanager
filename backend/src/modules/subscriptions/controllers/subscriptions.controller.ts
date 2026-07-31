import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';

import { SubscriptionsService } from '../services/subscriptions.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ChangePlanDto } from '../dto/change-plan.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return this.subscriptionsService.findByCompany('current', tenantId);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.subscriptionsService.findOne(id, tenantId);
  }

  @Post('trial/start')
  async startTrial(@Body() body: { companyId: string }) {
    return this.subscriptionsService.startTrial(body.companyId);
  }

  @Post(':id/change-plan')
  async changePlan(
    @Param('id') id: string,
    @Body() changePlanDto: ChangePlanDto,
    @TenantId() tenantId: string,
  ) {
    return this.subscriptionsService.changePlan(id, changePlanDto, tenantId);
  }
}
