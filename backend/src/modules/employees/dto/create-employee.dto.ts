import { IsString, IsEnum, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(['SERVER', 'BARTENDER', 'COOK', 'CLEANER', 'SECURITY', 'MANAGER'])
  role: 'SERVER' | 'BARTENDER' | 'COOK' | 'CLEANER' | 'SECURITY' | 'MANAGER';

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDate()
  @IsOptional()
  hireDate?: Date;
}
