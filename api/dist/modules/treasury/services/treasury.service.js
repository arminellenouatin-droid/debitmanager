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
exports.TreasuryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const treasury_transaction_entity_1 = require("../entities/treasury-transaction.entity");
let TreasuryService = class TreasuryService {
    constructor(transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }
    async create(createTransactionDto, tenantId, userId) {
        const transaction = this.transactionsRepository.create({
            type: createTransactionDto.type,
            amount: createTransactionDto.amount,
            description: createTransactionDto.description,
            category: createTransactionDto.category,
            reference: createTransactionDto.reference,
            relatedOrderId: createTransactionDto.relatedOrderId,
            tenantId,
            transactionDate: createTransactionDto.transactionDate || new Date(),
            createdBy: userId,
        });
        return this.transactionsRepository.save(transaction);
    }
    async findAll(tenantId, startDate, endDate, type) {
        const where = { tenantId };
        if (type) {
            where.type = type;
        }
        if (startDate && endDate) {
            where.transactionDate = () => `transactionDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
        }
        return this.transactionsRepository.find({
            where,
            order: { transactionDate: 'DESC' },
        });
    }
    async getBalance(tenantId, asOfDate) {
        const date = asOfDate || new Date();
        const transactions = await this.transactionsRepository.find({
            where: {
                tenantId,
                transactionDate: () => `transactionDate <= '${date.toISOString()}'`,
            },
        });
        const income = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            balance: income - expenses,
            totalIncome: income,
            totalExpenses: expenses,
            asOfDate: date,
        };
    }
    async getDailySummary(tenantId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const transactions = await this.findAll(tenantId, startOfDay, endOfDay);
        const income = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            date,
            income,
            expenses,
            net: income - expenses,
            transactionCount: transactions.length,
        };
    }
    async getMonthlySummary(tenantId, month) {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const transactions = await this.findAll(tenantId, startOfMonth, endOfMonth);
        const income = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === treasury_transaction_entity_1.TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        const byCategory = {};
        transactions.forEach(t => {
            const category = t.category || 'Uncategorized';
            byCategory[category] = (byCategory[category] || 0) + t.amount;
        });
        return {
            month,
            income,
            expenses,
            net: income - expenses,
            transactionCount: transactions.length,
            byCategory,
        };
    }
};
exports.TreasuryService = TreasuryService;
exports.TreasuryService = TreasuryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(treasury_transaction_entity_1.TreasuryTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TreasuryService);
//# sourceMappingURL=treasury.service.js.map