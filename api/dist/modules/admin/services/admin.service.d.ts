import { Repository } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class AdminService {
    private companiesRepository;
    private subscriptionsRepository;
    private usersRepository;
    private ordersRepository;
    constructor(companiesRepository: Repository<Company>, subscriptionsRepository: Repository<Subscription>, usersRepository: Repository<User>, ordersRepository: Repository<Order>);
    getDashboardStats(): Promise<{
        totalCompanies: number;
        activeCompanies: number;
        totalSubscriptions: number;
        activeSubscriptions: number;
        totalUsers: number;
        totalOrders: number;
        monthlyRevenue: any;
    }>;
    getCompanies(page?: number, limit?: number, status?: string): Promise<{
        companies: Company[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSubscriptions(page?: number, limit?: number, status?: string): Promise<{
        subscriptions: Subscription[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentActivity(limit?: number): Promise<{
        companies: Company[];
        subscriptions: Subscription[];
        orders: Order[];
    }>;
    getRevenueByMonth(year: number): Promise<any[]>;
    suspendCompany(companyId: string, reason: string): Promise<{
        message: string;
        reason: string;
    }>;
    activateCompany(companyId: string): Promise<{
        message: string;
    }>;
}
