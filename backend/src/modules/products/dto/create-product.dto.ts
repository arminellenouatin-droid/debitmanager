import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId: string;

  @IsString()
  productTypeId: string;

  @IsString()
  unitId: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @IsOptional()
  minStockThreshold?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
