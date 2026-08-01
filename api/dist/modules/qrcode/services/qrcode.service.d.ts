export declare class QRCodeService {
    generateOrderQRCode(orderId: string, tableId?: string): Promise<string>;
    generateTableQRCode(tableId: string, tenantId: string): Promise<string>;
    generateCompanyQRCode(companyId: string, tenantId: string): Promise<string>;
    parseQRCode(qrData: string): any;
}
