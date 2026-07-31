import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductType } from './entities/product-type.entity';
import { Unit } from './entities/unit.entity';
import { PriceHistory } from './entities/price-history.entity';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductType, Unit, PriceHistory]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
