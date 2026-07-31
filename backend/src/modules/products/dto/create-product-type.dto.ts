import { IsString, IsOptional } from 'class-validator';

export class CreateProductTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
