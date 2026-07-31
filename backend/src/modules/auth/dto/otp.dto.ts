import { IsString, MinLength } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @MinLength(10)
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(4)
  code: string;
}
