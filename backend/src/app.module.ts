import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { TablesModule } from './modules/tables/tables.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { TreasuryModule } from './modules/treasury/treasury.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { QRCodeModule } from './modules/qrcode/qrcode.module';

import { databaseConfig } from './config/database.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TenantInterceptor } from './common/interceptors/tenant-interceptor.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    TerminusModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    SubscriptionsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    EmployeesModule,
    AttendanceModule,
    InventoryModule,
    SuppliersModule,
    PurchaseOrdersModule,
    TablesModule,
    InvoicesModule,
    PayrollModule,
    TreasuryModule,
    NotificationsModule,
    ReportsModule,
    AffiliatesModule,
    AdminModule,
    AuditLogModule,
    QRCodeModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {
    // Apply global filters and interceptors
  }
}
