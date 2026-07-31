import { IsString, IsOptional } from 'class-validator';

export class WebhookDto {
  @IsString()
  aggregator: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  data?: any;
}
