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
exports.Product = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const product_type_entity_1 = require("./product-type.entity");
const unit_entity_1 = require("./unit.entity");
const price_history_entity_1 = require("./price-history.entity");
let Product = class Product {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, name: { required: true, type: () => String }, categoryId: { required: true, type: () => String }, typeId: { required: true, type: () => String }, unitId: { required: true, type: () => String }, price: { required: true, type: () => Number }, imageUrl: { required: true, type: () => String }, currentStock: { required: true, type: () => Number }, alertThreshold: { required: true, type: () => Number }, safetyThreshold: { required: true, type: () => Number }, minStockThreshold: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, category: { required: true, type: () => require("./category.entity").Category }, type: { required: true, type: () => require("./product-type.entity").ProductType }, unit: { required: true, type: () => require("./unit.entity").Unit }, priceHistory: { required: true, type: () => [require("./price-history.entity").PriceHistory] } };
    }
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Product.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type_id' }),
    __metadata("design:type", String)
], Product.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_id' }),
    __metadata("design:type", String)
], Product.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_stock', type: 'integer' }),
    __metadata("design:type", Number)
], Product.prototype, "currentStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alert_threshold', type: 'integer' }),
    __metadata("design:type", Number)
], Product.prototype, "alertThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'safety_threshold', type: 'integer' }),
    __metadata("design:type", Number)
], Product.prototype, "safetyThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_stock_threshold', type: 'integer', default: 5 }),
    __metadata("design:type", Number)
], Product.prototype, "minStockThreshold", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_type_entity_1.ProductType),
    (0, typeorm_1.JoinColumn)({ name: 'type_id' }),
    __metadata("design:type", product_type_entity_1.ProductType)
], Product.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit),
    (0, typeorm_1.JoinColumn)({ name: 'unit_id' }),
    __metadata("design:type", unit_entity_1.Unit)
], Product.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => price_history_entity_1.PriceHistory, (priceHistory) => priceHistory.product),
    __metadata("design:type", Array)
], Product.prototype, "priceHistory", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products'),
    (0, typeorm_1.Index)(['tenantId'])
], Product);
//# sourceMappingURL=product.entity.js.map