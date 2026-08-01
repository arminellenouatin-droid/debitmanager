import { Affiliate } from './affiliate.entity';
import { Company } from '../../companies/entities/company.entity';
export declare class ReferralTracking {
    id: string;
    affiliateId: string;
    trackingToken: string;
    clickedAt: Date;
    source: string;
    convertedCompanyId: string;
    convertedAt: Date;
    expiresAt: Date;
    createdAt: Date;
    affiliate: Affiliate;
    convertedCompany?: Company;
}
