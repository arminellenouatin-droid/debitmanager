"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const terminus_1 = require("@nestjs/terminus");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const companies_module_1 = require("./modules/companies/companies.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const employees_module_1 = require("./modules/employees/employees.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const purchase_orders_module_1 = require("./modules/purchase-orders/purchase-orders.module");
const tables_module_1 = require("./modules/tables/tables.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const treasury_module_1 = require("./modules/treasury/treasury.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const reports_module_1 = require("./modules/reports/reports.module");
const affiliates_module_1 = require("./modules/affiliates/affiliates.module");
const admin_module_1 = require("./modules/admin/admin.module");
const audit_log_module_1 = require("./modules/audit-log/audit-log.module");
const qrcode_module_1 = require("./modules/qrcode/qrcode.module");
const database_config_1 = require("./config/database.config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
    constructor() {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.databaseConfig,
                inject: [config_1.ConfigService],
            }),
            terminus_1.TerminusModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            subscriptions_module_1.SubscriptionsModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            employees_module_1.EmployeesModule,
            attendance_module_1.AttendanceModule,
            inventory_module_1.InventoryModule,
            suppliers_module_1.SuppliersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            tables_module_1.TablesModule,
            invoices_module_1.InvoicesModule,
            payroll_module_1.PayrollModule,
            treasury_module_1.TreasuryModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            affiliates_module_1.AffiliatesModule,
            admin_module_1.AdminModule,
            audit_log_module_1.AuditLogModule,
            qrcode_module_1.QRCodeModule,
        ],
        providers: [
            {
                provide: 'APP_FILTER',
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
//# sourceMappingURL=app.module.js.map