import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum PayrollStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
}

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  baseSalary: number;

  @Column('decimal', { precision: 10, scale: 2 })
  hoursWorked: number;

  @Column('decimal', { precision: 10, scale: 2 })
  overtimeHours: number;

  @Column('decimal', { precision: 10, scale: 2 })
  regularPay: number;

  @Column('decimal', { precision: 10, scale: 2 })
  overtimePay: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  bonuses: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deductions: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  advances: number;

  @Column('decimal', { precision: 10, scale: 2 })
  grossPay: number;

  @Column('decimal', { precision: 10, scale: 2 })
  netPay: number;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.PENDING,
  })
  status: PayrollStatus;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
