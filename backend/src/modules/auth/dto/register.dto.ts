import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['TENANT_STAFF', 'SUPER_ADMIN', 'AFFILIATE'])
  userType: 'TENANT_STAFF' | 'SUPER_ADMIN' | 'AFFILIATE';
}
