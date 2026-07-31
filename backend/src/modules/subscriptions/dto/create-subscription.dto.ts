import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEnum(['BASE', 'MOYENNE', 'SEMESTRIELLE', 'SUPREME'])
  plan: 'BASE' | 'MOYENNE' | 'SEMESTRIELLE' | 'SUPREME';

  @IsString()
  companyId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  paymentMethod?: 'CASH' | 'CARD' | 'MOBILE_MONEY';

  @IsString()
  @IsOptional()
  aggregator?: 'KKIAPAY' | 'MONEROO' | 'CINETPAY';
}
