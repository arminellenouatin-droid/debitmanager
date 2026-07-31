import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { TreasuryTransaction } from '../treasury/entities/treasury-transaction.entity';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, TreasuryTransaction]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
