import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { TablesService } from '../services/tables.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async create(@Body() createTableDto: CreateTableDto, @TenantId() tenantId: string) {
    return this.tablesService.create(createTableDto, tenantId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return this.tablesService.findAll(tenantId);
  }

  @Get('available')
  async findAvailable(@TenantId() tenantId: string) {
    return this.tablesService.findAvailable(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.tablesService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
    @TenantId() tenantId: string,
  ) {
    return this.tablesService.update(id, updateTableDto, tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' },
    @TenantId() tenantId: string,
  ) {
    return this.tablesService.updateStatus(id, body.status as any, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.tablesService.remove(id, tenantId);
  }
}
