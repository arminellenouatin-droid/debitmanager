import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Schedule } from './schedule.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Payroll } from '../../payroll/entities/payroll.entity';

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

@Entity('employees')
@Index(['tenantId'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 80 })
  position: string;

  @Column({ name: 'hourly_rate', type: 'integer', nullable: true })
  hourlyRate: number;

  @Column({ name: 'monthly_salary', type: 'integer', nullable: true })
  monthlySalary: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ length: 100, name: 'payment_account_ref' })
  paymentAccountRef: string;

  @Column({ nullable: true, name: 'id_document_url' })
  idDocumentUrl: string;

  @Column({ nullable: true, name: 'contract_document_url' })
  contractDocumentUrl: string;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Schedule, (schedule) => schedule.employee)
  schedules: Schedule[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @OneToMany(() => Payroll, (payroll) => payroll.employee)
  payrolls: Payroll[];
}
