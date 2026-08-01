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
exports.TreasuryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const treasury_service_1 = require("../services/treasury.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const tenant_id_decorator_1 = require("../../../common/decorators/tenant-id.decorator");
const user_id_decorator_1 = require("../../../common/decorators/user-id.decorator");
const create_transaction_dto_1 = require("../dto/create-transaction.dto");
let TreasuryController = class TreasuryController {
    constructor(treasuryService) {
        this.treasuryService = treasuryService;
    }
    async create(createTransactionDto, tenantId, userId) {
        return this.treasuryService.create(createTransactionDto, tenantId, userId);
    }
    async findAll(tenantId, startDate, endDate, type) {
        return this.treasuryService.findAll(tenantId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, type);
    }
    async getBalance(tenantId, asOf) {
        return this.treasuryService.getBalance(tenantId, asOf ? new Date(asOf) : undefined);
    }
    async getDailySummary(tenantId, date) {
        return this.treasuryService.getDailySummary(tenantId, date ? new Date(date) : new Date());
    }
    async getMonthlySummary(tenantId, month) {
        return this.treasuryService.getMonthlySummary(tenantId, month ? new Date(month) : new Date());
    }
};
exports.TreasuryController = TreasuryController;
__decorate([
    (0, common_1.Post)('transactions'),
    openapi.ApiResponse({ status: 201, type: require("../entities/treasury-transaction.entity").TreasuryTransaction }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __param(2, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto, String, String]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('transactions'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/treasury-transaction.entity").TreasuryTransaction] }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('balance'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('asOf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('summary/daily'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)('summary/monthly'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getMonthlySummary", null);
exports.TreasuryController = TreasuryController = __decorate([
    (0, common_1.Controller)('treasury'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [treasury_service_1.TreasuryService])
], TreasuryController);
//# sourceMappingURL=treasury.controller.js.map