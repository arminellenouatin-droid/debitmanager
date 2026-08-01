import { AdminService } from '../services/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalCompanies: number;
        activeCompanies: number;
        totalSubscriptions: number;
        activeSubscriptions: number;
        totalUsers: number;
        totalOrders: number;
        monthlyRevenue: any;
    }>;
    getCompanies(page?: string, limit?: string, status?: string): Promise<{
        companies: import("../../companies/entities/company.entity").Company[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSubscriptions(page?: string, limit?: string, status?: string): Promise<{
        subscriptions: import("../../subscriptions/entities/subscription.entity").Subscription[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentActivity(limit?: string): Promise<{
        companies: import("../../companies/entities/company.entity").Company[];
        subscriptions: import("../../subscriptions/entities/subscription.entity").Subscription[];
        orders: import("../../orders/entities/order.entity").Order[];
    }>;
    getRevenueByMonth(year?: string): Promise<any[]>;
    suspendCompany(id: string, body: {
        reason: string;
    }): Promise<{
        message: string;
        reason: string;
    }>;
    activateCompany(id: string): Promise<{
        message: string;
    }>;
}
