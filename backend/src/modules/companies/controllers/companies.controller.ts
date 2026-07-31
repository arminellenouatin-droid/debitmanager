import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';

import { CompaniesService } from '../services/companies.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { UserId } from '../../../common/decorators/user-id.decorator';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto, @UserId() userId: string) {
    return this.companiesService.create(createCompanyDto, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.companiesService.findOne(id, tenantId);
  }

  @Get(':id/join-code')
  async getJoinCode(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.companiesService.getJoinCode(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @TenantId() tenantId: string,
  ) {
    return this.companiesService.update(id, updateCompanyDto, tenantId);
  }

  @Post('join')
  async joinCompany(@Body() body: { code: string }, @Request() req) {
    // TODO: Implement join company logic for employees
    return { message: 'Join company functionality' };
  }
}
