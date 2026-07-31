import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payroll } from './entities/payroll.entity';
import { Employee } from './entities/employee.entity';
import { PayrollService } from './services/payroll.service';
import { PayrollController } from './controllers/payroll.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Employee]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
