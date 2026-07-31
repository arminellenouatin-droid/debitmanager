import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsNumber()
  capacity: number;

  @IsEnum(['AVAILABLE', 'OCCUPIED', 'RESERVED'])
  @IsOptional()
  status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

  @IsString()
  @IsOptional()
  location?: string;
}
