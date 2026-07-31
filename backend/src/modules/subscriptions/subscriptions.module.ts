import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Subscription } from './entities/subscription.entity';
import { Company } from '../companies/entities/company.entity';
import { Payment } from '../payments/entities/payment.entity';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Company, Payment]),
    ConfigModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
