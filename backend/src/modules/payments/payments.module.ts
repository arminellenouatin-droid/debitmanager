import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Payment } from './entities/payment.entity';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
