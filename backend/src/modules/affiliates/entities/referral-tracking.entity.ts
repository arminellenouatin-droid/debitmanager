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

@Entity('referral_tracking')
export class ReferralTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'affiliate_id' })
  affiliateId: string;

  @Column({ length: 64, name: 'tracking_token' })
  trackingToken: string;

  @Column({ name: 'clicked_at' })
  clickedAt: Date;

  @Column({ nullable: true, length: 100 })
  source: string;

  @Column({ nullable: true, name: 'converted_company_id' })
  convertedCompanyId: string;

  @Column({ nullable: true, name: 'converted_at' })
  convertedAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.referralTrackings)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'converted_company_id' })
  convertedCompany?: Company;
}
