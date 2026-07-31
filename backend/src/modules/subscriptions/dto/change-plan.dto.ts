import { IsEnum } from 'class-validator';

export class ChangePlanDto {
  @IsEnum(['BASE', 'MOYENNE', 'SEMESTRIELLE', 'SUPREME'])
  newPlan: 'BASE' | 'MOYENNE' | 'SEMESTRIELLE' | 'SUPREME';
}
