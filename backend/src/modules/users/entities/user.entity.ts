import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';

export enum UserType {
  TENANT_STAFF = 'TENANT_STAFF',
  SUPER_ADMIN = 'SUPER_ADMIN',
  AFFILIATE = 'AFFILIATE',
}

export enum UserStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ length: 80 })
  firstName: string;

  @Column({ length: 80 })
  lastName: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true, length: 150, nullable: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.TENANT_STAFF,
  })
  userType: UserType;

  @Column({ nullable: true })
  roleId: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VALIDATION,
  })
  status: UserStatus;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true, length: 45 })
  lastLoginIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Employee, { nullable: true })
  @JoinColumn()
  employee?: Employee;

  @OneToOne(() => Affiliate, { nullable: true })
  @JoinColumn()
  affiliate?: Affiliate;
}
