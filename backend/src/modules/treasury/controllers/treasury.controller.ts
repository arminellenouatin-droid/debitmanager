import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';

import { TreasuryService } from '../services/treasury.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { UserId } from '../../../common/decorators/user-id.decorator';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('treasury')
@UseGuards(JwtAuthGuard)
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Post('transactions')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @TenantId() tenantId: string,
    @UserId() userId: string,
  ) {
    return this.treasuryService.create(createTransactionDto, tenantId, userId);
  }

  @Get('transactions')
  async findAll(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
  ) {
    return this.treasuryService.findAll(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      type as any,
    );
  }

  @Get('balance')
  async getBalance(
    @TenantId() tenantId: string,
    @Query('asOf') asOf?: string,
  ) {
    return this.treasuryService.getBalance(
      tenantId,
      asOf ? new Date(asOf) : undefined,
    );
  }

  @Get('summary/daily')
  async getDailySummary(
    @TenantId() tenantId: string,
    @Query('date') date?: string,
  ) {
    return this.treasuryService.getDailySummary(
      tenantId,
      date ? new Date(date) : new Date(),
    );
  }

  @Get('summary/monthly')
  async getMonthlySummary(
    @TenantId() tenantId: string,
    @Query('month') month?: string,
  ) {
    return this.treasuryService.getMonthlySummary(
      tenantId,
      month ? new Date(month) : new Date(),
    );
  }
}
