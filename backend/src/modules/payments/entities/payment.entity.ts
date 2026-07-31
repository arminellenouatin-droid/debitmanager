import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PaymentPurpose {
  ORDER = 'ORDER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYROLL = 'PAYROLL',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum PaymentAggregator {
  KKIAPAY = 'KKIAPAY',
  MONEROO = 'MONEROO',
  CINETPAY = 'CINETPAY',
  NONE = 'NONE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
@Index(['tenantId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    type: 'enum',
    enum: PaymentPurpose,
    name: 'payment_purpose',
  })
  paymentPurpose: PaymentPurpose;

  @Column({ name: 'reference_id' })
  referenceId: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentAggregator,
    default: PaymentAggregator.NONE,
  })
  aggregator: PaymentAggregator;

  @Column({ nullable: true, length: 100, name: 'aggregator_reference' })
  aggregatorReference: string;

  @Column({ type: 'integer', name: 'platform_commission_amount', default: 0 })
  platformCommissionAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true, name: 'webhook_received_at' })
  webhookReceivedAt: Date;

  @Column({ default: false })
  reconciled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
