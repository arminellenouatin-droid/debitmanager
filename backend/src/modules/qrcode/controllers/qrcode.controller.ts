import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { QRCodeService } from '../services/qrcode.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('qrcode')
@UseGuards(JwtAuthGuard)
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Get('order/:id')
  async generateOrderQR(@Param('id') orderId: string) {
    return this.qrCodeService.generateOrderQRCode(orderId);
  }

  @Get('table/:id')
  async generateTableQR(@Param('id') tableId: string) {
    return this.qrCodeService.generateTableQRCode(tableId, 'tenant-id');
  }

  @Get('company/:id')
  async generateCompanyQR(@Param('id') companyId: string) {
    return this.qrCodeService.generateCompanyQRCode(companyId, 'tenant-id');
  }
}
