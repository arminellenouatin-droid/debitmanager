import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Affiliate } from './affiliate.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum CommissionStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

@Entity('affiliate_commissions')
export class AffiliateCommission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'affiliate_id' })
  affiliateId: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'subscription_id' })
  subscriptionId: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @Column({ nullable: true, name: 'validated_at' })
  validatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.commissions)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;
}
