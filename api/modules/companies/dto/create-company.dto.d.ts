export declare class CreateCompanyDto {
    name: string;
    activityType: 'BUVETTE' | 'BAR_RESTAURANT' | 'NIGHTCLUB_LOUNGE';
    country: string;
    currency: string;
    language: string;
    address?: string;
    logoUrl?: string;
    referralCode?: string;
}
