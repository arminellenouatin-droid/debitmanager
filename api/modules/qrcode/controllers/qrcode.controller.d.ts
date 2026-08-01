import { QRCodeService } from '../services/qrcode.service';
export declare class QRCodeController {
    private readonly qrCodeService;
    constructor(qrCodeService: QRCodeService);
    generateOrderQR(orderId: string): Promise<string>;
    generateTableQR(tableId: string): Promise<string>;
    generateCompanyQR(companyId: string): Promise<string>;
}
