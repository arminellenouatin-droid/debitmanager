import { CompaniesService } from '../services/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto, userId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        activityType: import("../entities/company.entity").ActivityType;
        uniqueCode: string;
        country: string;
        currency: string;
        language: string;
        logoUrl: string;
        address: string;
        status: import("../entities/company.entity").CompanyStatus;
        trialEndsAt: Date;
        ownerUserId: string;
        affiliateId: string;
        referralTrackingId: string;
        activityCoefficient: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        owner: import("../../users/entities/user.entity").User;
        subscriptions: import("../../subscriptions/entities/subscription.entity").Subscription[];
    }>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        activityType: import("../entities/company.entity").ActivityType;
        uniqueCode: string;
        country: string;
        currency: string;
        language: string;
        logoUrl: string;
        address: string;
        status: import("../entities/company.entity").CompanyStatus;
        trialEndsAt: Date;
        ownerUserId: string;
        affiliateId: string;
        referralTrackingId: string;
        activityCoefficient: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        owner: import("../../users/entities/user.entity").User;
        subscriptions: import("../../subscriptions/entities/subscription.entity").Subscription[];
    }>;
    getJoinCode(id: string, tenantId: string): Promise<{
        uniqueCode: string;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        activityType: import("../entities/company.entity").ActivityType;
        uniqueCode: string;
        country: string;
        currency: string;
        language: string;
        logoUrl: string;
        address: string;
        status: import("../entities/company.entity").CompanyStatus;
        trialEndsAt: Date;
        ownerUserId: string;
        affiliateId: string;
        referralTrackingId: string;
        activityCoefficient: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        owner: import("../../users/entities/user.entity").User;
        subscriptions: import("../../subscriptions/entities/subscription.entity").Subscription[];
    }>;
    joinCompany(body: {
        code: string;
    }, req: any): Promise<{
        message: string;
    }>;
}
