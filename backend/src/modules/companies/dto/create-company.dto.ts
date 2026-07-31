import { IsString, IsEnum, IsOptional, MinLength, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(['BUVETTE', 'BAR_RESTAURANT', 'NIGHTCLUB_LOUNGE'])
  activityType: 'BUVETTE' | 'BAR_RESTAURANT' | 'NIGHTCLUB_LOUNGE';

  @IsString()
  @MinLength(2)
  country: string;

  @IsString()
  @MinLength(2)
  currency: string;

  @IsString()
  @MinLength(2)
  language: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  referralCode?: string;
}
