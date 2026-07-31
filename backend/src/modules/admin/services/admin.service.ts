import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getDashboardStats() {
    const totalCompanies = await this.companiesRepository.count();
    const activeCompanies = await this.companiesRepository.count({
      where: { status: 'ACTIVE' as any },
    });

    const totalSubscriptions = await this.subscriptionsRepository.count();
    const activeSubscriptions = await this.subscriptionsRepository.count({
      where: { status: 'ACTIVE' as any },
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

  async getCompanies(page: number = 1, limit: number = 20, status?: string) {
    const where: any = {};
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

  async getSubscriptions(page: number = 1, limit: number = 20, status?: string) {
    const where: any = {};
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

  async getRecentActivity(limit: number = 50) {
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

  async getRevenueByMonth(year: number) {
    const revenueByMonth: any[] = [];

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

  async suspendCompany(companyId: string, reason: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    await this.companiesRepository.update(companyId, {
      status: 'SUSPENDED' as any,
    });

    return { message: 'Company suspended', reason };
  }

  async activateCompany(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    await this.companiesRepository.update(companyId, {
      status: 'ACTIVE' as any,
    });

    return { message: 'Company activated' };
  }
}
