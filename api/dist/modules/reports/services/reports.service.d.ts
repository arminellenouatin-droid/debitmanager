import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { TreasuryTransaction } from '../../treasury/entities/treasury-transaction.entity';
export declare class ReportsService {
    private ordersRepository;
    private productsRepository;
    private transactionsRepository;
    constructor(ordersRepository: Repository<Order>, productsRepository: Repository<Product>, transactionsRepository: Repository<TreasuryTransaction>);
    getDailyKPIs(tenantId: string, date: Date): Promise<{
        date: Date;
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        income: number;
        expenses: number;
        netCashFlow: number;
        ordersByStatus: {
            PENDING: number;
            IN_PREPARATION: number;
            READY: number;
            DELIVERED: number;
            PAID: number;
            CANCELLED: number;
        };
    }>;
    getWeeklyKPIs(tenantId: string, startDate: Date, endDate: Date): Promise<{
        startDate: Date;
        endDate: Date;
        totalRevenue: any;
        totalOrders: any;
        averageDailyRevenue: number;
        dailyData: any[];
    }>;
    getMonthlyKPIs(tenantId: string, year: number, month: number): Promise<{
        topProducts: any[];
        startDate: Date;
        endDate: Date;
        totalRevenue: any;
        totalOrders: any;
        averageDailyRevenue: number;
        dailyData: any[];
    }>;
    getProductPerformance(tenantId: string, startDate: Date, endDate: Date): Promise<{
        productId: string;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
        currentStock: number;
        lowStock: boolean;
    }[]>;
    getEmployeePerformance(tenantId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
