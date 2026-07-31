import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { TreasuryTransaction } from '../../treasury/entities/treasury-transaction.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(TreasuryTransaction)
    private transactionsRepository: Repository<TreasuryTransaction>,
  ) {}

  async getDailyKPIs(tenantId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.ordersRepository.find({
      where: {
        tenantId,
        createdAt: () => `createdAt BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
      } as any,
    });

    const transactions = await this.transactionsRepository.find({
      where: {
        tenantId,
        transactionDate: () => `transactionDate BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
      } as any,
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

  async getWeeklyKPIs(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await this.ordersRepository.find({
      where: {
        tenantId,
        createdAt: () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      } as any,
    });

    const transactions = await this.transactionsRepository.find({
      where: {
        tenantId,
        transactionDate: () => `transactionDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      } as any,
    });

    const dailyData: any[] = [];
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

  async getMonthlyKPIs(tenantId: string, year: number, month: number) {
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

  async getProductPerformance(tenantId: string, startDate: Date, endDate: Date) {
    const products = await this.productsRepository.find({
      where: { tenantId },
    });

    const productPerformance = await Promise.all(
      products.map(async (product) => {
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
      }),
    );

    return productPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getEmployeePerformance(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await this.ordersRepository.find({
      where: {
        tenantId,
        createdAt: () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      } as any,
    });

    const performanceByServer: Record<string, any> = {};

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
}
