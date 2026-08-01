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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("../services/payroll.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const tenant_id_decorator_1 = require("../../../common/decorators/tenant-id.decorator");
const create_payroll_dto_1 = require("../dto/create-payroll.dto");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async create(createPayrollDto, tenantId) {
        return this.payrollService.create(createPayrollDto, tenantId);
    }
    async findAll(tenantId, startDate, endDate) {
        return this.payrollService.findAll(tenantId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async findByEmployee(employeeId, tenantId) {
        return this.payrollService.findByEmployee(employeeId, tenantId);
    }
    async getSummary(tenantId, month) {
        return this.payrollService.getPayrollSummary(tenantId, month ? new Date(month) : new Date());
    }
    async approve(id, tenantId) {
        return this.payrollService.approve(id, tenantId);
    }
    async processPayment(id, tenantId) {
        return this.payrollService.processPayment(id, tenantId);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../entities/payroll.entity").Payroll }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.CreatePayrollDto, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("../entities/payroll.entity").Payroll] }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/payroll.entity").Payroll] }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    openapi.ApiResponse({ status: 200, type: require("../entities/payroll.entity").Payroll }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/pay'),
    openapi.ApiResponse({ status: 200, type: require("../entities/payroll.entity").Payroll }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "processPayment", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map