import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Affiliate } from './affiliate.entity';

export enum PayoutStatus {
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

@Entity('affiliate_payouts')
export class AffiliatePayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'affiliate_id' })
  affiliateId: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ nullable: true, name: 'period_start' })
  periodStart: Date;

  @Column({ nullable: true, name: 'period_end' })
  periodEnd: Date;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.REQUESTED,
  })
  status: PayoutStatus;

  @Column({ nullable: true, length: 100, name: 'payment_reference' })
  paymentReference: string;

  @Column({ nullable: true, name: 'processed_by_user_id' })
  processedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.payouts)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;
}
