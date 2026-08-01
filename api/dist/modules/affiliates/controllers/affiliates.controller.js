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
exports.AffiliatesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const affiliates_service_1 = require("../services/affiliates.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const user_id_decorator_1 = require("../../../common/decorators/user-id.decorator");
const tenant_id_decorator_1 = require("../../../common/decorators/tenant-id.decorator");
let AffiliatesController = class AffiliatesController {
    constructor(affiliatesService) {
        this.affiliatesService = affiliatesService;
    }
    async join(body, userId, tenantId) {
        return this.affiliatesService.createAffiliate(userId, body.referralCode, tenantId);
    }
    async getStats(userId) {
        return this.affiliatesService.getAffiliateStats(userId);
    }
    async getReferrals(userId) {
        return this.affiliatesService.getReferrals(userId);
    }
    async withdraw(body, userId) {
        return this.affiliatesService.withdrawCommission(userId, body.amount);
    }
};
exports.AffiliatesController = AffiliatesController;
__decorate([
    (0, common_1.Post)('join'),
    openapi.ApiResponse({ status: 201, type: require("../entities/affiliate.entity").Affiliate }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_id_decorator_1.UserId)()),
    __param(2, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AffiliatesController.prototype, "join", null);
__decorate([
    (0, common_1.Get)('stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AffiliatesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('referrals'),
    openapi.ApiResponse({ status: 200, type: [require("../entities/affiliate.entity").Affiliate] }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AffiliatesController.prototype, "getReferrals", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesController.prototype, "withdraw", null);
exports.AffiliatesController = AffiliatesController = __decorate([
    (0, common_1.Controller)('affiliates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [affiliates_service_1.AffiliatesService])
], AffiliatesController);
//# sourceMappingURL=affiliates.controller.js.map