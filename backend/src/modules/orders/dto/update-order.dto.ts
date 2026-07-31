import { IsEnum, IsString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(['PENDING', 'IN_PROGRESS', 'READY', 'SERVED', 'CANCELLED'])
  @IsOptional()
  status?: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'SERVED' | 'CANCELLED';

  @IsString()
  @IsOptional()
  notes?: string;
}
