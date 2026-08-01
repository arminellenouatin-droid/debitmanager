"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const table_entity_1 = require("../../tables/entities/table.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, productsRepository, tablesRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsRepository = productsRepository;
        this.tablesRepository = tablesRepository;
    }
    async create(createOrderDto, tenantId, userId) {
        const { tableId, orderType, items, notes, customerPhone } = createOrderDto;
        let table = null;
        if (tableId) {
            table = await this.tablesRepository.findOne({
                where: { id: tableId, tenantId },
            });
            if (!table) {
                throw new common_1.NotFoundException('Table not found');
            }
        }
        let totalAmount = 0;
        const validatedItems = [];
        for (const item of items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId, tenantId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            if (product.currentStock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
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
        const order = this.ordersRepository.create({
            tenantId,
            tableId: tableId || null,
            serverUserId: userId,
            source: order_entity_1.OrderSource.SERVER,
            status: order_entity_1.OrderStatus.PENDING,
            offlineCreated: false,
            clientGeneratedId: `ORD-${Date.now()}`,
        });
        const savedOrder = await this.ordersRepository.save(order);
        for (const item of validatedItems) {
            const orderItem = this.orderItemsRepository.create({
                tenantId,
                orderId: savedOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                section: 'BAR',
                status: order_item_entity_1.OrderItemStatus.PENDING,
            });
            await this.orderItemsRepository.save(orderItem);
            await this.productsRepository.update(item.productId, {
                currentStock: () => `current_stock - ${item.quantity}`,
            });
        }
        if (table) {
            await this.tablesRepository.update(tableId, {
                status: 'OCCUPIED',
            });
        }
        return this.findOne(savedOrder.id, tenantId);
    }
    async findAll(tenantId) {
        const orders = await this.ordersRepository.find({
            where: { tenantId },
            relations: ['table', 'items'],
            order: { createdAt: 'DESC' },
        });
        return orders.map(o => this.sanitizeOrder(o));
    }
    async findOne(id, tenantId) {
        const order = await this.ordersRepository.findOne({
            where: { id, tenantId },
            relations: ['table', 'items'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.sanitizeOrder(order);
    }
    async update(id, updateOrderDto, tenantId) {
        const order = await this.findOne(id, tenantId);
        const updateData = {};
        if (updateOrderDto.status)
            updateData.status = updateOrderDto.status;
        if (updateOrderDto.notes)
            updateData.notes = updateOrderDto.notes;
        await this.ordersRepository.update(id, updateData);
        const updated = await this.ordersRepository.findOne({ where: { id } });
        return this.sanitizeOrder(updated);
    }
    async addItem(id, addItemDto, tenantId) {
        const order = await this.findOne(id, tenantId);
        const { productId, quantity, unitPrice } = addItemDto;
        const product = await this.productsRepository.findOne({
            where: { id: productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.currentStock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const itemTotal = quantity * unitPrice;
        const orderItem = this.orderItemsRepository.create({
            tenantId,
            orderId: order.id,
            productId,
            quantity,
            unitPrice,
            totalPrice: itemTotal,
            section: 'BAR',
            status: order_item_entity_1.OrderItemStatus.PENDING,
        });
        await this.orderItemsRepository.save(orderItem);
        const newTotal = order.totalAmount + itemTotal;
        await this.ordersRepository.update(id, {});
        await this.productsRepository.update(productId, {
            currentStock: () => `current_stock - ${quantity}`,
        });
        return this.findOne(id, tenantId);
    }
    async cancelOrder(id, tenantId) {
        const order = await this.findOne(id, tenantId);
        if (order.status === order_entity_1.OrderStatus.CANCELLED || order.status === order_entity_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException('Cannot cancel this order');
        }
        for (const item of order.items) {
            await this.productsRepository.update(item.productId, {
                currentStock: () => `current_stock + ${item.quantity}`,
            });
        }
        await this.ordersRepository.update(id, {
            status: order_entity_1.OrderStatus.CANCELLED,
        });
        if (order.tableId) {
            await this.tablesRepository.update(order.tableId, {
                status: 'AVAILABLE',
            });
        }
        return { message: 'Order cancelled successfully' };
    }
    sanitizeOrder(order) {
        const { ...sanitized } = order;
        return sanitized;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map