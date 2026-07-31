import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { EmployeesService } from '../services/employees.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @TenantId() tenantId: string) {
    return this.employeesService.create(createEmployeeDto, tenantId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return this.employeesService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.employeesService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateEmployeeDto>,
    @TenantId() tenantId: string,
  ) {
    return this.employeesService.update(id, updateData, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.employeesService.remove(id, tenantId);
  }
}
