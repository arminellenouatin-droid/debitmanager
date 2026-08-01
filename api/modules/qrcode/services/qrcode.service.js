"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeService = void 0;
const common_1 = require("@nestjs/common");
const QRCode = require("qrcode");
let QRCodeService = class QRCodeService {
    async generateOrderQRCode(orderId, tableId) {
        const qrData = JSON.stringify({
            type: 'ORDER',
            orderId,
            tableId,
            timestamp: new Date().toISOString(),
        });
        return QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
    }
    async generateTableQRCode(tableId, tenantId) {
        const qrData = JSON.stringify({
            type: 'TABLE',
            tableId,
            tenantId,
            timestamp: new Date().toISOString(),
        });
        return QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
    }
    async generateCompanyQRCode(companyId, tenantId) {
        const qrData = JSON.stringify({
            type: 'COMPANY',
            companyId,
            tenantId,
            timestamp: new Date().toISOString(),
        });
        return QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
    }
    parseQRCode(qrData) {
        try {
            return JSON.parse(qrData);
        }
        catch (error) {
            throw new Error('Invalid QR code data');
        }
    }
};
exports.QRCodeService = QRCodeService;
exports.QRCodeService = QRCodeService = __decorate([
    (0, common_1.Injectable)()
], QRCodeService);
//# sourceMappingURL=qrcode.service.js.map