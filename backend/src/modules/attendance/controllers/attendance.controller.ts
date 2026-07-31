import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';

import { AttendanceService } from '../services/attendance.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto, @TenantId() tenantId: string) {
    return this.attendanceService.create(createAttendanceDto, tenantId);
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByEmployee(
      employeeId,
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('report')
  async getDailyReport(
    @TenantId() tenantId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getDailyReport(
      tenantId,
      date ? new Date(date) : new Date(),
    );
  }
}
