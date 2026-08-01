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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderSource = exports.OrderStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const table_entity_1 = require("../../tables/entities/table.entity");
const order_item_entity_1 = require("./order-item.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["IN_PREPARATION"] = "IN_PREPARATION";
    OrderStatus["READY"] = "READY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var OrderSource;
(function (OrderSource) {
    OrderSource["SERVER"] = "SERVER";
    OrderSource["QR_CLIENT"] = "QR_CLIENT";
})(OrderSource || (exports.OrderSource = OrderSource = {}));
let Order = class Order {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, tableId: { required: true, type: () => String }, serverUserId: { required: true, type: () => String }, status: { required: true, enum: require("./order.entity").OrderStatus }, source: { required: true, enum: require("./order.entity").OrderSource }, offlineCreated: { required: true, type: () => Boolean }, clientGeneratedId: { required: true, type: () => String }, cancelledReason: { required: true, type: () => String }, cancelledByUserId: { required: true, type: () => String }, totalAmount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, table: { required: false, type: () => require("../../tables/entities/table.entity").Table }, items: { required: true, type: () => [require("./order-item.entity").OrderItem] } };
    }
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Order.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'table_id', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'server_user_id' }),
    __metadata("design:type", String)
], Order.prototype, "serverUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderSource,
        default: OrderSource.SERVER,
    }),
    __metadata("design:type", String)
], Order.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'offline_created' }),
    __metadata("design:type", Boolean)
], Order.prototype, "offlineCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_generated_id' }),
    __metadata("design:type", String)
], Order.prototype, "clientGeneratedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255, name: 'cancelled_reason' }),
    __metadata("design:type", String)
], Order.prototype, "cancelledReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'cancelled_by_user_id' }),
    __metadata("design:type", String)
], Order.prototype, "cancelledByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'table_id' }),
    __metadata("design:type", table_entity_1.Table)
], Order.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (orderItem) => orderItem.order),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders'),
    (0, typeorm_1.Index)(['tenantId'])
], Order);
//# sourceMappingURL=order.entity.js.map