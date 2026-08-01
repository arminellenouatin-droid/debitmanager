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
exports.QRCodeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const qrcode_service_1 = require("../services/qrcode.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
let QRCodeController = class QRCodeController {
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    async generateOrderQR(orderId) {
        return this.qrCodeService.generateOrderQRCode(orderId);
    }
    async generateTableQR(tableId) {
        return this.qrCodeService.generateTableQRCode(tableId, 'tenant-id');
    }
    async generateCompanyQR(companyId) {
        return this.qrCodeService.generateCompanyQRCode(companyId, 'tenant-id');
    }
};
exports.QRCodeController = QRCodeController;
__decorate([
    (0, common_1.Get)('order/:id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QRCodeController.prototype, "generateOrderQR", null);
__decorate([
    (0, common_1.Get)('table/:id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QRCodeController.prototype, "generateTableQR", null);
__decorate([
    (0, common_1.Get)('company/:id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QRCodeController.prototype, "generateCompanyQR", null);
exports.QRCodeController = QRCodeController = __decorate([
    (0, common_1.Controller)('qrcode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [qrcode_service_1.QRCodeService])
], QRCodeController);
//# sourceMappingURL=qrcode.controller.js.map