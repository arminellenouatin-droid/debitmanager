import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReferralTracking } from './referral-tracking.entity';
import { AffiliateCommission } from './affiliate-commission.entity';
import { AffiliatePayout } from './affiliate-payout.entity';

export enum AffiliateStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export enum CommissionMode {
  FIRST_PAYMENT = 'FIRST_PAYMENT',
  RECURRING = 'RECURRING',
}

export enum AffiliatePaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

@Entity('affiliates')
export class Affiliate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ unique: true, length: 20, name: 'referral_code' })
  referralCode: string;

  @Column({ unique: true, length: 255, name: 'referral_link' })
  referralLink: string;

  @Column({
    type: 'enum',
    enum: AffiliatePaymentMethod,
  })
  paymentMethod: AffiliatePaymentMethod;

  @Column({ length: 100, name: 'payment_account_ref' })
  paymentAccountRef: string;

  @Column({
    type: 'enum',
    enum: AffiliateStatus,
    default: AffiliateStatus.PENDING_VALIDATION,
  })
  status: AffiliateStatus;

  @Column({ name: 'commission_rate_override', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRateOverride: number;

  @Column({
    type: 'enum',
    enum: CommissionMode,
    name: 'commission_mode_override',
    nullable: true,
  })
  commissionModeOverride: CommissionMode;

  @Column({ name: 'referred_by', nullable: true })
  referredBy: string;

  @Column({ name: 'commission_balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  commissionBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.affiliate)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ReferralTracking, (tracking) => tracking.affiliate)
  referralTrackings: ReferralTracking[];

  @OneToMany(() => AffiliateCommission, (commission) => commission.affiliate)
  commissions: AffiliateCommission[];

  @OneToMany(() => AffiliatePayout, (payout) => payout.affiliate)
  payouts: AffiliatePayout[];
}
