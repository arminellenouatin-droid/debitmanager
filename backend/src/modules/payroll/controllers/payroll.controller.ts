import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';

import { PayrollService } from '../services/payroll.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreatePayrollDto } from '../dto/create-payroll.dto';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  async create(@Body() createPayrollDto: CreatePayrollDto, @TenantId() tenantId: string) {
    return this.payrollService.create(createPayrollDto, tenantId);
  }

  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.payrollService.findAll(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('employee/:employeeId')
  async findByEmployee(@Param('employeeId') employeeId: string, @TenantId() tenantId: string) {
    return this.payrollService.findByEmployee(employeeId, tenantId);
  }

  @Get('summary')
  async getSummary(
    @TenantId() tenantId: string,
    @Query('month') month?: string,
  ) {
    return this.payrollService.getPayrollSummary(
      tenantId,
      month ? new Date(month) : new Date(),
    );
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.payrollService.approve(id, tenantId);
  }

  @Patch(':id/pay')
  async processPayment(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.payrollService.processPayment(id, tenantId);
  }
}
