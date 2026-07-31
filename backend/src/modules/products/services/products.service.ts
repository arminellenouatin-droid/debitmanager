import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductType } from '../entities/product-type.entity';
import { Unit } from '../entities/unit.entity';
import { PriceHistory } from '../entities/price-history.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateProductTypeDto } from '../dto/create-product-type.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductType)
    private productTypesRepository: Repository<ProductType>,
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  async create(createProductDto: CreateProductDto, tenantId: string, userId: string) {
    const { categoryId, productTypeId, unitId, price, costPrice } = createProductDto;

    // Validate category
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, tenantId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Validate product type
    const productType = await this.productTypesRepository.findOne({
      where: { id: productTypeId, tenantId },
    });
    if (!productType) {
      throw new NotFoundException('Product type not found');
    }

    // Validate unit
    const unit = await this.unitsRepository.findOne({
      where: { id: unitId, tenantId },
    });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Create product
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

    // Create price history entry
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

  async findAll(tenantId: string) {
    const products = await this.productsRepository.find({
      where: { tenantId },
      relations: ['category', 'productType', 'unit'],
      order: { name: 'ASC' },
    });

    return products.map(p => this.sanitizeProduct(p));
  }

  async findOne(id: string, tenantId: string) {
    const product = await this.productsRepository.findOne({
      where: { id, tenantId },
      relations: ['category', 'productType', 'unit', 'priceHistory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.sanitizeProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, tenantId: string, userId: string) {
    const product = await this.findOne(id, tenantId);

    const { price, costPrice, stockQuantity, minStockThreshold } = updateProductDto;

    // If price changed, create price history entry
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

    const updateData: any = {};
    if (price !== undefined) updateData.price = price;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (stockQuantity !== undefined) updateData.currentStock = stockQuantity;
    if (minStockThreshold !== undefined) updateData.alertThreshold = minStockThreshold;
    if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name;
    if (updateProductDto.description !== undefined) updateData.description = updateProductDto.description;
    if (updateProductDto.categoryId !== undefined) updateData.categoryId = updateProductDto.categoryId;
    if (updateProductDto.productTypeId !== undefined) updateData.typeId = updateProductDto.productTypeId;
    if (updateProductDto.unitId !== undefined) updateData.unitId = updateProductDto.unitId;
    if (updateProductDto.imageUrl !== undefined) updateData.imageUrl = updateProductDto.imageUrl;
    if (updateProductDto.isActive !== undefined) updateData.isActive = updateProductDto.isActive;

    await this.productsRepository.update(id, updateData);

    const updated = await this.productsRepository.findOne({ where: { id } });
    return this.sanitizeProduct(updated);
  }

  async remove(id: string, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    
    await this.productsRepository.softDelete(id);
    
    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: string, quantity: number, tenantId: string) {
    const product = await this.findOne(id, tenantId);

    const newQuantity = product.currentStock + quantity;

    if (newQuantity < 0) {
      throw new ConflictException('Insufficient stock');
    }

    await this.productsRepository.update(id, {
      currentStock: newQuantity,
    });

    // Check if stock is below threshold
    const isLowStock = newQuantity <= product.minStockThreshold;

    return {
      productId: product.id,
      newQuantity,
      isLowStock,
    };
  }

  async getLowStockProducts(tenantId: string) {
    const products = await this.productsRepository.find({
      where: { tenantId },
      relations: ['category', 'unit'],
    });

    const lowStockProducts = products.filter(
      p => p.currentStock <= p.alertThreshold
    );

    return lowStockProducts.map(p => this.sanitizeProduct(p));
  }

  // Category methods
  async createCategory(createCategoryDto: CreateCategoryDto, tenantId: string) {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      tenantId,
    });

    return this.categoriesRepository.save(category);
  }

  async findCategories(tenantId: string) {
    return this.categoriesRepository.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  // Product Type methods
  async createProductType(createProductTypeDto: CreateProductTypeDto, tenantId: string) {
    const productType = this.productTypesRepository.create({
      ...createProductTypeDto,
      tenantId,
    });

    return this.productTypesRepository.save(productType);
  }

  async findProductTypes(tenantId: string) {
    return this.productTypesRepository.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  // Unit methods
  async createUnit(createUnitDto: CreateUnitDto, tenantId: string) {
    const unit = this.unitsRepository.create({
      ...createUnitDto,
      tenantId,
    });

    return this.unitsRepository.save(unit);
  }

  async findUnits(tenantId: string) {
    return this.unitsRepository.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  private sanitizeProduct(product: Product) {
    const { ...sanitized } = product;
    return sanitized;
  }
}
