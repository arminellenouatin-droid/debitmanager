import { IsString, IsNumber, IsDate, IsArray, IsOptional } from 'class-validator';

export class CreatePayrollDto {
  @IsString()
  employeeId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  baseSalary: number;

  @IsNumber()
  hoursWorked: number;

  @IsNumber()
  overtimeHours: number;

  @IsNumber()
  @IsOptional()
  bonuses?: number;

  @IsNumber()
  @IsOptional()
  deductions?: number;

  @IsArray()
  @IsOptional()
  advances?: Array<{ amount: number; date: Date; reason: string }>;
}
