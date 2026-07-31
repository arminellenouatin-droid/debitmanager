import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum ActivityType {
  BUVETTE = 'BUVETTE',
  BAR_RESTAURANT = 'BAR_RESTAURANT',
  NIGHTCLUB_LOUNGE = 'NIGHTCLUB_LOUNGE',
}

export enum CompanyStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  GRACE_PERIOD = 'GRACE_PERIOD',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('companies')
@Index(['tenantId'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  activityType: ActivityType;

  @Column({ unique: true, length: 10, name: 'unique_code' })
  uniqueCode: string;

  @Column({ length: 2 })
  country: string;

  @Column({ length: 3, default: 'XOF' })
  currency: string;

  @Column({ length: 5, default: 'fr' })
  language: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.TRIAL,
  })
  status: CompanyStatus;

  @Column({ nullable: true, name: 'trial_ends_at' })
  trialEndsAt: Date;

  @Column({ name: 'owner_user_id' })
  ownerUserId: string;

  @Column({ nullable: true, name: 'affiliate_id' })
  affiliateId: string;

  @Column({ nullable: true, name: 'referral_tracking_id' })
  referralTrackingId: string;

  @Column({ name: 'activity_coefficient', type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  activityCoefficient: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;

  @OneToMany(() => Subscription, (subscription) => subscription.company)
  subscriptions: Subscription[];
}
