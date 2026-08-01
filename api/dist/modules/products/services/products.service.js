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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const product_type_entity_1 = require("../entities/product-type.entity");
const unit_entity_1 = require("../entities/unit.entity");
const price_history_entity_1 = require("../entities/price-history.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository, productTypesRepository, unitsRepository, priceHistoryRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.productTypesRepository = productTypesRepository;
        this.unitsRepository = unitsRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }
    async create(createProductDto, tenantId, userId) {
        const { categoryId, productTypeId, unitId, price, costPrice } = createProductDto;
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId, tenantId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const productType = await this.productTypesRepository.findOne({
            where: { id: productTypeId, tenantId },
        });
        if (!productType) {
            throw new common_1.NotFoundException('Product type not found');
        }
        const unit = await this.unitsRepository.findOne({
            where: { id: unitId, tenantId },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        const product = this.productsRepository.create({
            name: createProductDto.name,
            tenantId,
            categoryId,
            typeId: productTypeId,
            unitId,
            price,
            imageUrl: createProductDto.imageUrl,
            currentStock: createProductDto.stockQuantity || 0,
            alertThreshold: createProductDto.minStockThreshold || 10,
            safetyThreshold: 0,
        });
        const savedProduct = await this.productsRepository.save(product);
        const priceHistory = this.priceHistoryRepository.create({
            tenantId,
            productId: savedProduct.id,
            price,
            costPrice: costPrice || 0,
            changedBy: userId,
        });
        await this.priceHistoryRepository.save(priceHistory);
        return this.sanitizeProduct(savedProduct);
    }
    async findAll(tenantId) {
        const products = await this.productsRepository.find({
            where: { tenantId },
            relations: ['category', 'productType', 'unit'],
            order: { name: 'ASC' },
        });
        return products.map(p => this.sanitizeProduct(p));
    }
    async findOne(id, tenantId) {
        const product = await this.productsRepository.findOne({
            where: { id, tenantId },
            relations: ['category', 'productType', 'unit', 'priceHistory'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.sanitizeProduct(product);
    }
    async update(id, updateProductDto, tenantId, userId) {
        const product = await this.findOne(id, tenantId);
        const { price, costPrice, stockQuantity, minStockThreshold } = updateProductDto;
        if (price && price !== product.price) {
            const priceHistory = this.priceHistoryRepository.create({
                tenantId,
                productId: product.id,
                price,
                costPrice: costPrice || 0,
                changedBy: userId,
            });
            await this.priceHistoryRepository.save(priceHistory);
        }
        const updateData = {};
        if (price !== undefined)
            updateData.price = price;
        if (costPrice !== undefined)
            updateData.costPrice = costPrice;
        if (stockQuantity !== undefined)
            updateData.currentStock = stockQuantity;
        if (minStockThreshold !== undefined)
            updateData.alertThreshold = minStockThreshold;
        if (updateProductDto.name !== undefined)
            updateData.name = updateProductDto.name;
        if (updateProductDto.description !== undefined)
            updateData.description = updateProductDto.description;
        if (updateProductDto.categoryId !== undefined)
            updateData.categoryId = updateProductDto.categoryId;
        if (updateProductDto.productTypeId !== undefined)
            updateData.typeId = updateProductDto.productTypeId;
        if (updateProductDto.unitId !== undefined)
            updateData.unitId = updateProductDto.unitId;
        if (updateProductDto.imageUrl !== undefined)
            updateData.imageUrl = updateProductDto.imageUrl;
        if (updateProductDto.isActive !== undefined)
            updateData.isActive = updateProductDto.isActive;
        await this.productsRepository.update(id, updateData);
        const updated = await this.productsRepository.findOne({ where: { id } });
        return this.sanitizeProduct(updated);
    }
    async remove(id, tenantId) {
        const product = await this.findOne(id, tenantId);
        await this.productsRepository.softDelete(id);
        return { message: 'Product deleted successfully' };
    }
    async updateStock(id, quantity, tenantId) {
        const product = await this.findOne(id, tenantId);
        const newQuantity = product.currentStock + quantity;
        if (newQuantity < 0) {
            throw new common_1.ConflictException('Insufficient stock');
        }
        await this.productsRepository.update(id, {
            currentStock: newQuantity,
        });
        const isLowStock = newQuantity <= product.minStockThreshold;
        return {
            productId: product.id,
            newQuantity,
            isLowStock,
        };
    }
    async getLowStockProducts(tenantId) {
        const products = await this.productsRepository.find({
            where: { tenantId },
            relations: ['category', 'unit'],
        });
        const lowStockProducts = products.filter(p => p.currentStock <= p.alertThreshold);
        return lowStockProducts.map(p => this.sanitizeProduct(p));
    }
    async createCategory(createCategoryDto, tenantId) {
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            tenantId,
        });
        return this.categoriesRepository.save(category);
    }
    async findCategories(tenantId) {
        return this.categoriesRepository.find({
            where: { tenantId },
            order: { name: 'ASC' },
        });
    }
    async createProductType(createProductTypeDto, tenantId) {
        const productType = this.productTypesRepository.create({
            ...createProductTypeDto,
            tenantId,
        });
        return this.productTypesRepository.save(productType);
    }
    async findProductTypes(tenantId) {
        return this.productTypesRepository.find({
            where: { tenantId },
            order: { name: 'ASC' },
        });
    }
    async createUnit(createUnitDto, tenantId) {
        const unit = this.unitsRepository.create({
            ...createUnitDto,
            tenantId,
        });
        return this.unitsRepository.save(unit);
    }
    async findUnits(tenantId) {
        return this.unitsRepository.find({
            where: { tenantId },
            order: { name: 'ASC' },
        });
    }
    sanitizeProduct(product) {
        const { ...sanitized } = product;
        return sanitized;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(product_type_entity_1.ProductType)),
    __param(3, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __param(4, (0, typeorm_1.InjectRepository)(price_history_entity_1.PriceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map