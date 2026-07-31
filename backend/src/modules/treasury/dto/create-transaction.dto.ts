import { IsString, IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['INCOME', 'EXPENSE', 'TRANSFER'])
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  relatedOrderId?: string;

  @IsDate()
  @IsOptional()
  transactionDate?: Date;
}
