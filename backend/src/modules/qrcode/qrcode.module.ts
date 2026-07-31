import { Module } from '@nestjs/common';
import { QRCodeService } from './services/qrcode.service';
import { QRCodeController } from './controllers/qrcode.controller';

@Module({
  controllers: [QRCodeController],
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QRCodeModule {}
