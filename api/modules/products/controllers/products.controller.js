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
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const products_service_1 = require("../services/products.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const tenant_id_decorator_1 = require("../../../common/decorators/tenant-id.decorator");
const user_id_decorator_1 = require("../../../common/decorators/user-id.decorator");
const create_product_dto_1 = require("../dto/create-product.dto");
const update_product_dto_1 = require("../dto/update-product.dto");
const create_category_dto_1 = require("../dto/create-category.dto");
const create_product_type_dto_1 = require("../dto/create-product-type.dto");
const create_unit_dto_1 = require("../dto/create-unit.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, tenantId, userId) {
        return this.productsService.create(createProductDto, tenantId, userId);
    }
    async findAll(tenantId) {
        return this.productsService.findAll(tenantId);
    }
    async getLowStock(tenantId) {
        return this.productsService.getLowStockProducts(tenantId);
    }
    async findOne(id, tenantId) {
        return this.productsService.findOne(id, tenantId);
    }
    async update(id, updateProductDto, tenantId, userId) {
        return this.productsService.update(id, updateProductDto, tenantId, userId);
    }
    async updateStock(id, body, tenantId) {
        return this.productsService.updateStock(id, body.quantity, tenantId);
    }
    async remove(id, tenantId) {
        return this.productsService.remove(id, tenantId);
    }
    async createCategory(createCategoryDto, tenantId) {
        return this.productsService.createCategory(createCategoryDto, tenantId);
    }
    async findCategories(tenantId) {
        return this.productsService.findCategories(tenantId);
    }
    async createProductType(createProductTypeDto, tenantId) {
        return this.productsService.createProductType(createProductTypeDto, tenantId);
    }
    async findProductTypes(tenantId) {
        return this.productsService.findProductTypes(tenantId);
    }
    async createUnit(createUnitDto, tenantId) {
        return this.productsService.createUnit(createUnitDto, tenantId);
    }
    async findUnits(tenantId) {
        return this.productsService.findUnits(tenantId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __param(2, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_id_decorator_1.TenantId)()),
    __param(3, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('categories'),
    openapi.ApiResponse({ status: 201, type: require("../entities/category.entity").Category }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories/all'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/category.entity").Category] }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Post)('types'),
    openapi.ApiResponse({ status: 201, type: require("../entities/product-type.entity").ProductType }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_type_dto_1.CreateProductTypeDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProductType", null);
__decorate([
    (0, common_1.Get)('types/all'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/product-type.entity").ProductType] }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductTypes", null);
__decorate([
    (0, common_1.Post)('units'),
    openapi.ApiResponse({ status: 201, type: require("../entities/unit.entity").Unit }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unit_dto_1.CreateUnitDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Get)('units/all'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/unit.entity").Unit] }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findUnits", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map