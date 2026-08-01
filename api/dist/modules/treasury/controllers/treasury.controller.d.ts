import { TreasuryService } from '../services/treasury.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
export declare class TreasuryController {
    private readonly treasuryService;
    constructor(treasuryService: TreasuryService);
    create(createTransactionDto: CreateTransactionDto, tenantId: string, userId: string): Promise<import("../entities/treasury-transaction.entity").TreasuryTransaction>;
    findAll(tenantId: string, startDate?: string, endDate?: string, type?: string): Promise<import("../entities/treasury-transaction.entity").TreasuryTransaction[]>;
    getBalance(tenantId: string, asOf?: string): Promise<{
        balance: number;
        totalIncome: number;
        totalExpenses: number;
        asOfDate: Date;
    }>;
    getDailySummary(tenantId: string, date?: string): Promise<{
        date: Date;
        income: number;
        expenses: number;
        net: number;
        transactionCount: number;
    }>;
    getMonthlySummary(tenantId: string, month?: string): Promise<{
        month: Date;
        income: number;
        expenses: number;
        net: number;
        transactionCount: number;
        byCategory: Record<string, number>;
    }>;
}
