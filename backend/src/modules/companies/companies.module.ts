import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './entities/company.entity';
import { Affiliate } from '../affiliates/entities/affiliate.entity';
import { ReferralTracking } from '../affiliates/entities/referral-tracking.entity';
import { CompaniesService } from './services/companies.service';
import { CompaniesController } from './controllers/companies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Affiliate, ReferralTracking]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
