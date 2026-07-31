import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { AffiliatesService } from '../services/affiliates.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserId } from '../../../common/decorators/user-id.decorator';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';

@Controller('affiliates')
@UseGuards(JwtAuthGuard)
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post('join')
  async join(
    @Body() body: { referralCode: string },
    @UserId() userId: string,
    @TenantId() tenantId: string,
  ) {
    return this.affiliatesService.createAffiliate(userId, body.referralCode, tenantId);
  }

  @Get('stats')
  async getStats(@UserId() userId: string) {
    return this.affiliatesService.getAffiliateStats(userId);
  }

  @Get('referrals')
  async getReferrals(@UserId() userId: string) {
    return this.affiliatesService.getReferrals(userId);
  }

  @Post('withdraw')
  async withdraw(
    @Body() body: { amount: number },
    @UserId() userId: string,
  ) {
    return this.affiliatesService.withdrawCommission(userId, body.amount);
  }
}
