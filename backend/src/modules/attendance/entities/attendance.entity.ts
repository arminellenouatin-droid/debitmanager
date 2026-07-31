import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

export enum AttendanceStatus {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  EXCEPTION = 'EXCEPTION',
}

@Entity('attendance')
@Index(['tenantId'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'check_in_at' })
  checkInAt: Date;

  @Column({ name: 'check_in_lat', type: 'decimal', precision: 9, scale: 6 })
  checkInLat: number;

  @Column({ name: 'check_in_lng', type: 'decimal', precision: 9, scale: 6 })
  checkInLng: number;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ON_TIME,
  })
  status: AttendanceStatus;

  @Column({ nullable: true, length: 255, name: 'exception_reason' })
  exceptionReason: string;

  @Column({ nullable: true, name: 'exception_granted_by_user_id' })
  exceptionGrantedByUserId: string;

  @Column({ nullable: true, name: 'check_out_at' })
  checkOutAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
