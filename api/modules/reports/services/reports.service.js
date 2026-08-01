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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const treasury_transaction_entity_1 = require("../../treasury/entities/treasury-transaction.entity");
let ReportsService = class ReportsService {
    constructor(ordersRepository, productsRepository, transactionsRepository) {
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
        this.transactionsRepository = transactionsRepository;
    }
    async getDailyKPIs(tenantId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const orders = await this.ordersRepository.find({
            where: {
                tenantId,
                createdAt: () => `createdAt BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
            },
        });
        const transactions = await this.transactionsRepository.find({
            where: {
                tenantId,
                transactionDate: () => `transactionDate BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
            },
        });
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.status === 'PAID')
            .reduce((sum, o) => sum + o.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const income = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);
        const ordersByStatus = {
            PENDING: orders.filter(o => o.status === 'PENDING').length,
            IN_PREPARATION: orders.filter(o => o.status === 'IN_PREPARATION').length,
            READY: orders.filter(o => o.status === 'READY').length,
            DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
            PAID: orders.filter(o => o.status === 'PAID').length,
            CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
        };
        return {
            date,
            totalOrders,
            totalRevenue,
            averageOrderValue,
            income,
            expenses,
            netCashFlow: income - expenses,
            ordersByStatus,
        };
    }
    async getWeeklyKPIs(tenantId, startDate, endDate) {
        const orders = await this.ordersRepository.find({
            where: {
                tenantId,
                createdAt: () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
            },
        });
        const transactions = await this.transactionsRepository.find({
            where: {
                tenantId,
                transactionDate: () => `transactionDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
            },
        });
        const dailyData = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            const dayStart = new Date(current);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(current);
            dayEnd.setHours(23, 59, 59, 999);
            const dayOrders = orders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= dayStart && orderDate <= dayEnd;
            });
            const dayRevenue = dayOrders
                .filter(o => o.status === 'PAID')
                .reduce((sum, o) => sum + o.totalAmount, 0);
            dailyData.push({
                date: new Date(current),
                orders: dayOrders.length,
                revenue: dayRevenue,
            });
            current.setDate(current.getDate() + 1);
        }
        const totalRevenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = dailyData.reduce((sum, d) => sum + d.orders, 0);
        return {
            startDate,
            endDate,
            totalRevenue,
            totalOrders,
            averageDailyRevenue: totalRevenue / dailyData.length,
            dailyData,
        };
    }
    async getMonthlyKPIs(tenantId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const weeklyKPIs = await this.getWeeklyKPIs(tenantId, startDate, endDate);
        const topProducts = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoin('order.items', 'item')
            .select('item.productId, SUM(item.quantity) as totalQuantity, SUM(item.totalPrice) as totalRevenue')
            .where('order.tenantId = :tenantId', { tenantId })
            .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        })
            .groupBy('item.productId')
            .orderBy('totalQuantity', 'DESC')
            .limit(10)
            .getRawMany();
        return {
            ...weeklyKPIs,
            topProducts,
        };
    }
    async getProductPerformance(tenantId, startDate, endDate) {
        const products = await this.productsRepository.find({
            where: { tenantId },
        });
        const productPerformance = await Promise.all(products.map(async (product) => {
            const orders = await this.ordersRepository
                .createQueryBuilder('order')
                .leftJoin('order.items', 'item')
                .where('order.tenantId = :tenantId', { tenantId })
                .andWhere('item.productId = :productId', { productId: product.id })
                .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            })
                .getMany();
            const totalQuantity = orders.reduce((sum, o) => {
                const item = o.items.find(i => i.productId === product.id);
                return sum + (item?.quantity || 0);
            }, 0);
            const totalRevenue = orders.reduce((sum, o) => {
                const item = o.items.find(i => i.productId === product.id);
                return sum + (item?.totalPrice || 0);
            }, 0);
            return {
                productId: product.id,
                productName: product.name,
                totalQuantity,
                totalRevenue,
                currentStock: product.currentStock,
                lowStock: product.currentStock <= product.alertThreshold,
            };
        }));
        return productPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
    async getEmployeePerformance(tenantId, startDate, endDate) {
        const orders = await this.ordersRepository.find({
            where: {
                tenantId,
                createdAt: () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
            },
        });
        const performanceByServer = {};
        orders.forEach(order => {
            if (order.serverUserId) {
                if (!performanceByServer[order.serverUserId]) {
                    performanceByServer[order.serverUserId] = {
                        serverUserId: order.serverUserId,
                        totalOrders: 0,
                        totalRevenue: 0,
                    };
                }
                performanceByServer[order.serverUserId].totalOrders++;
                performanceByServer[order.serverUserId].totalRevenue += order.totalAmount;
            }
        });
        return Object.values(performanceByServer).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(treasury_transaction_entity_1.TreasuryTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map