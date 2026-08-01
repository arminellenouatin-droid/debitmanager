import { ReportsService } from '../services/reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailyKPIs(tenantId: string, date?: string): Promise<{
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
    getWeeklyKPIs(tenantId: string, startDate?: string, endDate?: string): Promise<{
        startDate: Date;
        endDate: Date;
        totalRevenue: any;
        totalOrders: any;
        averageDailyRevenue: number;
        dailyData: any[];
    }>;
    getMonthlyKPIs(tenantId: string, year?: string, month?: string): Promise<{
        topProducts: any[];
        startDate: Date;
        endDate: Date;
        totalRevenue: any;
        totalOrders: any;
        averageDailyRevenue: number;
        dailyData: any[];
    }>;
    getProductPerformance(tenantId: string, startDate?: string, endDate?: string): Promise<{
        productId: string;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
        currentStock: number;
        lowStock: boolean;
    }[]>;
    getEmployeePerformance(tenantId: string, startDate?: string, endDate?: string): Promise<any[]>;
}
