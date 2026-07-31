import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { UserId } from '../../../common/decorators/user-id.decorator';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateProductTypeDto } from '../dto/create-product-type.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @TenantId() tenantId: string, @UserId() userId: string) {
    return this.productsService.create(createProductDto, tenantId, userId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return this.productsService.findAll(tenantId);
  }

  @Get('low-stock')
  async getLowStock(@TenantId() tenantId: string) {
    return this.productsService.getLowStockProducts(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.productsService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @TenantId() tenantId: string,
    @UserId() userId: string,
  ) {
    return this.productsService.update(id, updateProductDto, tenantId, userId);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
    @TenantId() tenantId: string,
  ) {
    return this.productsService.updateStock(id, body.quantity, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.productsService.remove(id, tenantId);
  }

  // Category endpoints
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @TenantId() tenantId: string) {
    return this.productsService.createCategory(createCategoryDto, tenantId);
  }

  @Get('categories/all')
  async findCategories(@TenantId() tenantId: string) {
    return this.productsService.findCategories(tenantId);
  }

  // Product Type endpoints
  @Post('types')
  async createProductType(@Body() createProductTypeDto: CreateProductTypeDto, @TenantId() tenantId: string) {
    return this.productsService.createProductType(createProductTypeDto, tenantId);
  }

  @Get('types/all')
  async findProductTypes(@TenantId() tenantId: string) {
    return this.productsService.findProductTypes(tenantId);
  }

  // Unit endpoints
  @Post('units')
  async createUnit(@Body() createUnitDto: CreateUnitDto, @TenantId() tenantId: string) {
    return this.productsService.createUnit(createUnitDto, tenantId);
  }

  @Get('units/all')
  async findUnits(@TenantId() tenantId: string) {
    return this.productsService.findUnits(tenantId);
  }
}
