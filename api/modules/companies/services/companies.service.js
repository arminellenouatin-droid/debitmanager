"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const company_entity_1 = require("../entities/company.entity");
const affiliate_entity_1 = require("../../affiliates/entities/affiliate.entity");
const referral_tracking_entity_1 = require("../../affiliates/entities/referral-tracking.entity");
let CompaniesService = class CompaniesService {
    constructor(companiesRepository, affiliatesRepository, referralTrackingRepository) {
        this.companiesRepository = companiesRepository;
        this.affiliatesRepository = affiliatesRepository;
        this.referralTrackingRepository = referralTrackingRepository;
    }
    async create(createCompanyDto, ownerId) {
        const { activityType, referralCode } = createCompanyDto;
        const uniqueCode = await this.generateUniqueCode();
        const activityCoefficient = this.getActivityCoefficient(activityType);
        let affiliateId = null;
        let referralTrackingId = null;
        if (referralCode) {
            const affiliate = await this.affiliatesRepository.findOne({
                where: { referralCode, status: 'ACTIVE' },
            });
            if (affiliate) {
                affiliateId = affiliate.id;
                const tracking = this.referralTrackingRepository.create({
                    affiliateId: affiliate.id,
                    trackingToken: this.generateTrackingToken(),
                    clickedAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    convertedCompanyId: null,
                });
                const savedTracking = await this.referralTrackingRepository.save(tracking);
                referralTrackingId = savedTracking.id;
            }
        }
        const company = this.companiesRepository.create({
            name: createCompanyDto.name,
            activityType: createCompanyDto.activityType,
            country: createCompanyDto.country,
            currency: createCompanyDto.currency,
            language: createCompanyDto.language,
            tenantId: uniqueCode,
            uniqueCode,
            activityCoefficient,
            status: company_entity_1.CompanyStatus.TRIAL,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            ownerUserId: ownerId,
            affiliateId,
            referralTrackingId,
        });
        const savedCompany = await this.companiesRepository.save(company);
        if (referralTrackingId) {
            await this.referralTrackingRepository.update(referralTrackingId, {
                convertedCompanyId: savedCompany.id,
                convertedAt: new Date(),
            });
        }
        return this.sanitizeCompany(savedCompany);
    }
    async findOne(id, tenantId) {
        const company = await this.companiesRepository.findOne({
            where: { id, tenantId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return this.sanitizeCompany(company);
    }
    async findByUniqueCode(uniqueCode) {
        const company = await this.companiesRepository.findOne({
            where: { uniqueCode },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return this.sanitizeCompany(company);
    }
    async update(id, updateCompanyDto, tenantId) {
        const company = await this.findOne(id, tenantId);
        const updateData = {};
        if (updateCompanyDto.name)
            updateData.name = updateCompanyDto.name;
        if (updateCompanyDto.activityType)
            updateData.activityType = updateCompanyDto.activityType;
        if (updateCompanyDto.country)
            updateData.country = updateCompanyDto.country;
        if (updateCompanyDto.currency)
            updateData.currency = updateCompanyDto.currency;
        if (updateCompanyDto.language)
            updateData.language = updateCompanyDto.language;
        await this.companiesRepository.update(id, updateData);
        const updated = await this.companiesRepository.findOne({ where: { id } });
        return this.sanitizeCompany(updated);
    }
    async getJoinCode(id, tenantId) {
        const company = await this.findOne(id, tenantId);
        return { uniqueCode: company.uniqueCode };
    }
    async generateUniqueCode() {
        let code;
        let attempts = 0;
        do {
            code = this.generateRandomCode(10);
            attempts++;
            if (attempts > 100) {
                throw new common_1.ConflictException('Could not generate unique code');
            }
        } while (await this.companiesRepository.findOne({ where: { uniqueCode: code } }));
        return code;
    }
    generateRandomCode(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    generateTrackingToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    getActivityCoefficient(activityType) {
        switch (activityType) {
            case 'BUVETTE':
                return 1.0;
            case 'BAR_RESTAURANT':
                return 1.5;
            case 'NIGHTCLUB_LOUNGE':
                return 2.0;
            default:
                return 1.0;
        }
    }
    sanitizeCompany(company) {
        const { ...sanitized } = company;
        return sanitized;
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(affiliate_entity_1.Affiliate)),
    __param(2, (0, typeorm_1.InjectRepository)(referral_tracking_entity_1.ReferralTracking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map