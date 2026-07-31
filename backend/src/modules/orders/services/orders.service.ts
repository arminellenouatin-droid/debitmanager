import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus, OrderSource } from '../entities/order.entity';
import { OrderItem, OrderItemStatus } from '../entities/order-item.entity';
import { Product } from '../../products/entities/product.entity';
import { Table } from '../../tables/entities/table.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AddItemDto } from '../dto/add-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(createOrderDto: CreateOrderDto, tenantId: string, userId: string) {
    const { tableId, orderType, items, notes, customerPhone } = createOrderDto;

    // Validate table if provided
    let table = null;
    if (tableId) {
      table = await this.tablesRepository.findOne({
        where: { id: tableId, tenantId },
      });
      if (!table) {
        throw new NotFoundException('Table not found');
      }
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId, tenantId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.currentStock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
      });
    }

    // Create order
    const order = this.ordersRepository.create({
      tenantId,
      tableId: tableId || null,
      serverUserId: userId,
      source: OrderSource.SERVER,
      status: OrderStatus.PENDING,
      offlineCreated: false,
      clientGeneratedId: `ORD-${Date.now()}`,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of validatedItems) {
      const orderItem = this.orderItemsRepository.create({
        tenantId,
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        section: 'BAR' as any,
        status: OrderItemStatus.PENDING,
      });
      await this.orderItemsRepository.save(orderItem);

      // Update product stock
      await this.productsRepository.update(item.productId, {
        currentStock: () => `current_stock - ${item.quantity}`,
      });
    }

    // Update table status if applicable
    if (table) {
      await this.tablesRepository.update(tableId, {
        status: 'OCCUPIED' as any,
      });
    }

    return this.findOne(savedOrder.id, tenantId);
  }

  async findAll(tenantId: string) {
    const orders = await this.ordersRepository.find({
      where: { tenantId },
      relations: ['table', 'items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map(o => this.sanitizeOrder(o));
  }

  async findOne(id: string, tenantId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, tenantId },
      relations: ['table', 'items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.sanitizeOrder(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, tenantId: string) {
    const order = await this.findOne(id, tenantId);

    const updateData: any = {};
    if (updateOrderDto.status) updateData.status = updateOrderDto.status as any;
    if (updateOrderDto.notes) updateData.notes = updateOrderDto.notes;

    await this.ordersRepository.update(id, updateData);

    const updated = await this.ordersRepository.findOne({ where: { id } });
    return this.sanitizeOrder(updated);
  }

  async addItem(id: string, addItemDto: AddItemDto, tenantId: string) {
    const order = await this.findOne(id, tenantId);

    const { productId, quantity, unitPrice } = addItemDto;

    // Validate product
    const product = await this.productsRepository.findOne({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.currentStock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Create order item
    const itemTotal = quantity * unitPrice;
    const orderItem = this.orderItemsRepository.create({
      tenantId,
      orderId: order.id,
      productId,
      quantity,
      unitPrice,
      totalPrice: itemTotal,
      section: 'BAR' as any,
      status: OrderItemStatus.PENDING,
    });
    await this.orderItemsRepository.save(orderItem);

    // Update order total
    const newTotal = order.totalAmount + itemTotal;
    await this.ordersRepository.update(id, {
      // Note: totalAmount field doesn't exist in entity, will be calculated from items
    });

    // Update product stock
    await this.productsRepository.update(productId, {
      currentStock: () => `current_stock - ${quantity}`,
    });

    return this.findOne(id, tenantId);
  }

  async cancelOrder(id: string, tenantId: string) {
    const order = await this.findOne(id, tenantId);

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot cancel this order');
    }

    // Restore stock for all items
    for (const item of order.items) {
      await this.productsRepository.update(item.productId, {
        currentStock: () => `current_stock + ${item.quantity}`,
      });
    }

    await this.ordersRepository.update(id, {
      status: OrderStatus.CANCELLED,
    });

    // Update table status if applicable
    if (order.tableId) {
      await this.tablesRepository.update(order.tableId, {
        status: 'AVAILABLE' as any,
      });
    }

    return { message: 'Order cancelled successfully' };
  }

  private sanitizeOrder(order: Order) {
    const { ...sanitized } = order;
    return sanitized;
  }
}
