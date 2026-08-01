import { Repository } from 'typeorm';
import { TreasuryTransaction, TransactionType } from '../entities/treasury-transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
export declare class TreasuryService {
    private transactionsRepository;
    constructor(transactionsRepository: Repository<TreasuryTransaction>);
    create(createTransactionDto: CreateTransactionDto, tenantId: string, userId: string): Promise<TreasuryTransaction>;
    findAll(tenantId: string, startDate?: Date, endDate?: Date, type?: TransactionType): Promise<TreasuryTransaction[]>;
    getBalance(tenantId: string, asOfDate?: Date): Promise<{
        balance: number;
        totalIncome: number;
        totalExpenses: number;
        asOfDate: Date;
    }>;
    getDailySummary(tenantId: string, date: Date): Promise<{
        date: Date;
        income: number;
        expenses: number;
        net: number;
        transactionCount: number;
    }>;
    getMonthlySummary(tenantId: string, month: Date): Promise<{
        month: Date;
        income: number;
        expenses: number;
        net: number;
        transactionCount: number;
        byCategory: Record<string, number>;
    }>;
}
