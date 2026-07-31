import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { UserId } from '../../../common/decorators/user-id.decorator';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AddItemDto } from '../dto/add-item.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @TenantId() tenantId: string, @UserId() userId: string) {
    return this.ordersService.create(createOrderDto, tenantId, userId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return this.ordersService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.ordersService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @TenantId() tenantId: string,
  ) {
    return this.ordersService.update(id, updateOrderDto, tenantId);
  }

  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddItemDto,
    @TenantId() tenantId: string,
  ) {
    return this.ordersService.addItem(id, addItemDto, tenantId);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.ordersService.cancelOrder(id, tenantId);
  }
}
