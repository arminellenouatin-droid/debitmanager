import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Affiliate } from './entities/affiliate.entity';
import { Company } from '../companies/entities/company.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { AffiliatesService } from './services/affiliates.service';
import { AffiliatesController } from './controllers/affiliates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Affiliate, Company, Subscription]),
  ],
  controllers: [AffiliatesController],
  providers: [AffiliatesService],
  exports: [AffiliatesService],
})
export class AffiliatesModule {}
