import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  async getDailyKPIs(
    @TenantId() tenantId: string,
    @Query('date') date?: string,
  ) {
    return this.reportsService.getDailyKPIs(
      tenantId,
      date ? new Date(date) : new Date(),
    );
  }

  @Get('weekly')
  async getWeeklyKPIs(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getWeeklyKPIs(tenantId, start, end);
  }

  @Get('monthly')
  async getMonthlyKPIs(
    @TenantId() tenantId: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date();
    return this.reportsService.getMonthlyKPIs(
      tenantId,
      year ? parseInt(year) : now.getFullYear(),
      month ? parseInt(month) : now.getMonth() + 1,
    );
  }

  @Get('products')
  async getProductPerformance(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getProductPerformance(tenantId, start, end);
  }

  @Get('employees')
  async getEmployeePerformance(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getEmployeePerformance(tenantId, start, end);
  }
}
