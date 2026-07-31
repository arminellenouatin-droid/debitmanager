import { IsString, IsNumber } from 'class-validator';

export class AddItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
