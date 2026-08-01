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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const subscription_entity_1 = require("../entities/subscription.entity");
const company_entity_1 = require("../../companies/entities/company.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionsRepository, companiesRepository, paymentsRepository, configService) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.companiesRepository = companiesRepository;
        this.paymentsRepository = paymentsRepository;
        this.configService = configService;
    }
    async create(createSubscriptionDto) {
        const { plan, companyId, amount, currency, paymentMethod, aggregator } = createSubscriptionDto;
        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const { periodStart, periodEnd } = this.calculatePeriod(plan);
        const payment = this.paymentsRepository.create({
            tenantId: company.tenantId,
            paymentPurpose: 'SUBSCRIPTION',
            referenceId: companyId,
            amount,
            method: paymentMethod || 'CASH',
            aggregator: aggregator || 'NONE',
            platformCommissionAmount: 0,
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        const savedPayment = await this.paymentsRepository.save(payment);
        const subscription = this.subscriptionsRepository.create({
            tenantId: company.tenantId,
            plan: plan,
            activityCoefficient: company.activityCoefficient,
            amount,
            currency,
            periodStart,
            periodEnd,
            status: subscription_entity_1.SubscriptionStatus.PENDING,
            paymentId: savedPayment.id,
            autoRenew: false,
        });
        const savedSubscription = await this.subscriptionsRepository.save(subscription);
        await this.paymentsRepository.update(savedPayment.id, {
            referenceId: savedSubscription.id,
        });
        if (paymentMethod === 'CASH') {
            await this.activateSubscription(savedSubscription.id);
        }
        return {
            subscription: this.sanitizeSubscription(savedSubscription),
            payment: savedPayment,
        };
    }
    async findOne(id, tenantId) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { id, tenantId },
            relations: ['payment'],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        return this.sanitizeSubscription(subscription);
    }
    async findByCompany(companyId, tenantId) {
        const subscriptions = await this.subscriptionsRepository.find({
            where: { tenantId },
            relations: ['payment'],
            order: { createdAt: 'DESC' },
        });
        return subscriptions.map(s => this.sanitizeSubscription(s));
    }
    async changePlan(id, changePlanDto, tenantId) {
        const { newPlan } = changePlanDto;
        const subscription = await this.findOne(id, tenantId);
        if (subscription.status !== subscription_entity_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Can only change plan for active subscriptions');
        }
        const proratedAmount = this.calculateProratedAmount(subscription, newPlan);
        const { periodStart, periodEnd } = this.calculatePeriod(newPlan);
        const newSubscription = this.subscriptionsRepository.create({
            tenantId: subscription.tenantId,
            plan: newPlan,
            activityCoefficient: subscription.activityCoefficient,
            amount: proratedAmount,
            currency: subscription.currency,
            periodStart,
            periodEnd,
            status: subscription_entity_1.SubscriptionStatus.PENDING,
            autoRenew: subscription.autoRenew,
        });
        const savedNewSubscription = await this.subscriptionsRepository.save(newSubscription);
        return this.sanitizeSubscription(savedNewSubscription);
    }
    async startTrial(companyId) {
        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const trialDays = this.configService.get('TRIAL_PERIOD_DAYS', 14);
        const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
        await this.companiesRepository.update(companyId, {
            status: company_entity_1.CompanyStatus.TRIAL,
            trialEndsAt,
        });
        return {
            message: 'Trial started successfully',
            trialEndsAt,
        };
    }
    async activateSubscription(id) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { id },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        await this.subscriptionsRepository.update(id, {
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
        });
        await this.companiesRepository.update(subscription.tenantId, {
            status: company_entity_1.CompanyStatus.ACTIVE,
        });
        return { message: 'Subscription activated successfully' };
    }
    async getPlans() {
        const basePricing = {
            BASE: { monthly: 50000, quarterly: 130000, semiannual: 240000, annual: 400000 },
            MOYENNE: { monthly: 75000, quarterly: 195000, semiannual: 360000, annual: 600000 },
            SEMESTRIELLE: { monthly: 100000, quarterly: 260000, semiannual: 480000, annual: 800000 },
            SUPREME: { monthly: 150000, quarterly: 390000, semiannual: 720000, annual: 1200000 },
        };
        return {
            currency: 'XOF',
            plans: basePricing,
        };
    }
    calculatePeriod(plan) {
        const now = new Date();
        let periodEnd;
        switch (plan) {
            case 'BASE':
                periodEnd = new Date(now.setMonth(now.getMonth() + 1));
                break;
            case 'MOYENNE':
                periodEnd = new Date(now.setMonth(now.getMonth() + 3));
                break;
            case 'SEMESTRIELLE':
                periodEnd = new Date(now.setMonth(now.getMonth() + 6));
                break;
            case 'SUPREME':
                periodEnd = new Date(now.setFullYear(now.getFullYear() + 1));
                break;
            default:
                periodEnd = new Date(now.setMonth(now.getMonth() + 1));
        }
        return { periodStart: new Date(), periodEnd };
    }
    calculateProratedAmount(subscription, newPlan) {
        const now = new Date();
        const remainingDays = Math.ceil((subscription.periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const totalDays = Math.ceil((subscription.periodEnd.getTime() - subscription.periodStart.getTime()) / (1000 * 60 * 60 * 24));
        const baseAmount = this.getBaseAmount(newPlan);
        const proratedAmount = Math.round((baseAmount * remainingDays) / totalDays);
        return proratedAmount;
    }
    getBaseAmount(plan) {
        const basePricing = {
            BASE: 50000,
            MOYENNE: 75000,
            SEMESTRIELLE: 100000,
            SUPREME: 150000,
        };
        return basePricing[plan] || 50000;
    }
    sanitizeSubscription(subscription) {
        const { ...sanitized } = subscription;
        return sanitized;
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map