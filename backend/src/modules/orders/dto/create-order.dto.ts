import { IsString, IsEnum, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  tableId?: string;

  @IsEnum(['DINE_IN', 'TAKEAWAY', 'DELIVERY'])
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

  @IsArray()
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;
}
