import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsEnum(['ORDER', 'SUBSCRIPTION', 'PAYROLL'])
  paymentPurpose: 'ORDER' | 'SUBSCRIPTION' | 'PAYROLL';

  @IsString()
  referenceId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(['CASH', 'CARD', 'MOBILE_MONEY'])
  method: 'CASH' | 'CARD' | 'MOBILE_MONEY';

  @IsEnum(['KKIAPAY', 'MONEROO', 'CINETPAY', 'NONE'])
  @IsOptional()
  aggregator?: 'KKIAPAY' | 'MONEROO' | 'CINETPAY' | 'NONE';

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cardToken?: string;
}
