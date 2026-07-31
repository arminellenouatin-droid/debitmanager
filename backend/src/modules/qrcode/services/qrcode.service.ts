import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generateOrderQRCode(orderId: string, tableId?: string): Promise<string> {
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

  async generateTableQRCode(tableId: string, tenantId: string): Promise<string> {
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

  async generateCompanyQRCode(companyId: string, tenantId: string): Promise<string> {
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

  parseQRCode(qrData: string): any {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      throw new Error('Invalid QR code data');
    }
  }
}
