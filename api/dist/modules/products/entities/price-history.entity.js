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
exports.PriceHistory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let PriceHistory = class PriceHistory {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, productId: { required: true, type: () => String }, price: { required: true, type: () => Number }, costPrice: { required: true, type: () => Number }, changedBy: { required: true, type: () => String }, changedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("./product.entity").Product } };
    }
};
exports.PriceHistory = PriceHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PriceHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], PriceHistory.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], PriceHistory.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], PriceHistory.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_price', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], PriceHistory.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by_user_id' }),
    __metadata("design:type", String)
], PriceHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], PriceHistory.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.priceHistory),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PriceHistory.prototype, "product", void 0);
exports.PriceHistory = PriceHistory = __decorate([
    (0, typeorm_1.Entity)('price_history')
], PriceHistory);
//# sourceMappingURL=price-history.entity.js.map