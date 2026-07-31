import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum PlanType {
  BASE = 'BASE',
  MOYENNE = 'MOYENNE',
  SEMESTRIELLE = 'SEMESTRIELLE',
  SUPREME = 'SUPREME',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  GRACE_PERIOD = 'GRACE_PERIOD',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

@Entity('subscriptions')
@Index(['tenantId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    type: 'enum',
    enum: PlanType,
  })
  plan: PlanType;

  @Column({ type: 'decimal', precision: 3, scale: 2, name: 'activity_coefficient' })
  activityCoefficient: number;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ name: 'period_start' })
  periodStart: Date;

  @Column({ name: 'period_end' })
  periodEnd: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({ nullable: true, name: 'payment_id' })
  paymentId: string;

  @Column({ default: false, name: 'auto_renew' })
  autoRenew: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.subscriptions)
  @JoinColumn({ name: 'tenant_id' })
  company: Company;

  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payment?: Payment;
}
