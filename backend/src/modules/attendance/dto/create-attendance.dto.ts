import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  employeeId: string;

  @IsEnum(['CHECK_IN', 'CHECK_OUT'])
  type: 'CHECK_IN' | 'CHECK_OUT';

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
