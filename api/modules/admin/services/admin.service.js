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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../../companies/entities/company.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
let AdminService = class AdminService {
    constructor(companiesRepository, subscriptionsRepository, usersRepository, ordersRepository) {
        this.companiesRepository = companiesRepository;
        this.subscriptionsRepository = subscriptionsRepository;
        this.usersRepository = usersRepository;
        this.ordersRepository = ordersRepository;
    }
    async getDashboardStats() {
        const totalCompanies = await this.companiesRepository.count();
        const activeCompanies = await this.companiesRepository.count({
            where: { status: 'ACTIVE' },
        });
        const totalSubscriptions = await this.subscriptionsRepository.count();
        const activeSubscriptions = await this.subscriptionsRepository.count({
            where: { status: 'ACTIVE' },
        });
        const totalUsers = await this.usersRepository.count();
        const totalOrders = await this.ordersRepository.count();
        const monthlyRevenue = await this.subscriptionsRepository
            .createQueryBuilder('sub')
            .select('SUM(sub.amount)')
            .where('sub.status = :status', { status: 'ACTIVE' })
            .getRawOne();
        const revenue = monthlyRevenue.sum || 0;
        return {
            totalCompanies,
            activeCompanies,
            totalSubscriptions,
            activeSubscriptions,
            totalUsers,
            totalOrders,
            monthlyRevenue: revenue,
        };
    }
    async getCompanies(page = 1, limit = 20, status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        const [companies, total] = await this.companiesRepository.findAndCount({
            where,
            relations: ['subscription'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            companies,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getSubscriptions(page = 1, limit = 20, status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        const [subscriptions, total] = await this.subscriptionsRepository.findAndCount({
            where,
            relations: ['company'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            subscriptions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getRecentActivity(limit = 50) {
        const recentCompanies = await this.companiesRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
        const recentSubscriptions = await this.subscriptionsRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
        const recentOrders = await this.ordersRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return {
            companies: recentCompanies,
            subscriptions: recentSubscriptions,
            orders: recentOrders,
        };
    }
    async getRevenueByMonth(year) {
        const revenueByMonth = [];
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            const result = await this.subscriptionsRepository
                .createQueryBuilder('sub')
                .select('SUM(sub.amount)')
                .where('sub.createdAt BETWEEN :startDate AND :endDate', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            })
                .getRawOne();
            revenueByMonth.push({
                month,
                revenue: result.sum || 0,
            });
        }
        return revenueByMonth;
    }
    async suspendCompany(companyId, reason) {
        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        await this.companiesRepository.update(companyId, {
            status: 'SUSPENDED',
        });
        return { message: 'Company suspended', reason };
    }
    async activateCompany(companyId) {
        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        await this.companiesRepository.update(companyId, {
            status: 'ACTIVE',
        });
        return { message: 'Company activated' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map