import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreasuryTransaction } from './entities/treasury-transaction.entity';
import { TreasuryService } from './services/treasury.service';
import { TreasuryController } from './controllers/treasury.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TreasuryTransaction]),
  ],
  controllers: [TreasuryController],
  providers: [TreasuryService],
  exports: [TreasuryService],
})
export class TreasuryModule {}
