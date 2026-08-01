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
exports.AffiliatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const affiliate_entity_1 = require("../entities/affiliate.entity");
const company_entity_1 = require("../../companies/entities/company.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
let AffiliatesService = class AffiliatesService {
    constructor(affiliatesRepository, companiesRepository, subscriptionsRepository) {
        this.affiliatesRepository = affiliatesRepository;
        this.companiesRepository = companiesRepository;
        this.subscriptionsRepository = subscriptionsRepository;
    }
    async createAffiliate(userId, referralCode, tenantId) {
        const existing = await this.affiliatesRepository.findOne({
            where: { userId },
        });
        if (existing) {
            throw new common_1.BadRequestException('User already has an affiliate account');
        }
        const referrer = await this.affiliatesRepository.findOne({
            where: { referralCode, status: affiliate_entity_1.AffiliateStatus.ACTIVE },
        });
        if (!referrer) {
            throw new common_1.NotFoundException('Invalid referral code');
        }
        const affiliate = this.affiliatesRepository.create({
            userId,
            referralCode: await this.generateReferralCode(),
            referralLink: `https://app.debitmanager.com/ref/${await this.generateReferralCode()}`,
            paymentMethod: 'MOBILE_MONEY',
            paymentAccountRef: '',
            tenantId,
            referredBy: referrer.id,
            commissionBalance: 0,
        });
        return this.affiliatesRepository.save(affiliate);
    }
    async generateReferralCode() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existing = await this.affiliatesRepository.findOne({
            where: { referralCode: code },
        });
        if (existing) {
            return this.generateReferralCode();
        }
        return code;
    }
    async getAffiliateStats(userId) {
        const affiliate = await this.affiliatesRepository.findOne({
            where: { userId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate account not found');
        }
        const referrals = await this.affiliatesRepository.find({
            where: { referredBy: affiliate.id },
        });
        const activeReferrals = referrals.filter(r => r.status === affiliate_entity_1.AffiliateStatus.ACTIVE).length;
        const referredUserIds = referrals.map(r => r.userId);
        const subscriptions = await this.subscriptionsRepository.find({
            where: { companyId: () => `companyId IN ('${referredUserIds.join("','")}')` },
        });
        const totalCommission = subscriptions.reduce((sum, sub) => {
            return sum + (sub.amount * 0.1);
        }, 0);
        return {
            referralCode: affiliate.referralCode,
            totalReferrals: referrals.length,
            activeReferrals,
            totalCommission,
            status: affiliate.status,
        };
    }
    async getReferrals(userId) {
        const affiliate = await this.affiliatesRepository.findOne({
            where: { userId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate account not found');
        }
        const referrals = await this.affiliatesRepository.find({
            where: { referredBy: affiliate.id },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        return referrals;
    }
    async processCommission(subscriptionId) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { id: subscriptionId },
            relations: ['company'],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const affiliate = await this.affiliatesRepository.findOne({
            where: { userId: subscription.company.ownerUserId },
        });
        if (!affiliate || !affiliate.referredBy) {
            return { message: 'No affiliate to credit' };
        }
        const commission = subscription.amount * 0.1;
        const referrer = await this.affiliatesRepository.findOne({
            where: { id: affiliate.referredBy },
        });
        if (!referrer) {
            return { message: 'Referrer not found' };
        }
        await this.affiliatesRepository.update(affiliate.referredBy, {
            commissionBalance: referrer.commissionBalance + commission,
        });
        return {
            message: 'Commission processed',
            commission,
            referrerId: affiliate.referredBy,
        };
    }
    async withdrawCommission(userId, amount) {
        const affiliate = await this.affiliatesRepository.findOne({
            where: { userId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate account not found');
        }
        if (affiliate.commissionBalance < amount) {
            throw new common_1.BadRequestException('Insufficient commission balance');
        }
        await this.affiliatesRepository.update(affiliate.id, {
            commissionBalance: affiliate.commissionBalance - amount,
        });
        return {
            message: 'Withdrawal processed',
            amount,
            remainingBalance: affiliate.commissionBalance - amount,
        };
    }
};
exports.AffiliatesService = AffiliatesService;
exports.AffiliatesService = AffiliatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(affiliate_entity_1.Affiliate)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AffiliatesService);
//# sourceMappingURL=affiliates.service.js.map