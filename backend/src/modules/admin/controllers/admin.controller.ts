import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';

import { AdminService } from '../services/admin.service';
import { AdminAuthGuard } from '../../../common/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('companies')
  async getCompanies(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getCompanies(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @Get('subscriptions')
  async getSubscriptions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getSubscriptions(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @Get('activity')
  async getRecentActivity(@Query('limit') limit?: string) {
    return this.adminService.getRecentActivity(limit ? parseInt(limit) : 50);
  }

  @Get('revenue')
  async getRevenueByMonth(@Query('year') year?: string) {
    return this.adminService.getRevenueByMonth(year ? parseInt(year) : new Date().getFullYear());
  }

  @Patch('companies/:id/suspend')
  async suspendCompany(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.suspendCompany(id, body.reason);
  }

  @Patch('companies/:id/activate')
  async activateCompany(@Param('id') id: string) {
    return this.adminService.activateCompany(id);
  }
}
