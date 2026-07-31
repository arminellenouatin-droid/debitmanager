import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TreasuryTransaction, TransactionType } from '../entities/treasury-transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TreasuryService {
  constructor(
    @InjectRepository(TreasuryTransaction)
    private transactionsRepository: Repository<TreasuryTransaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, tenantId: string, userId: string) {
    const transaction = this.transactionsRepository.create({
      type: createTransactionDto.type as any,
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

  async findAll(tenantId: string, startDate?: Date, endDate?: Date, type?: TransactionType) {
    const where: any = { tenantId };

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

  async getBalance(tenantId: string, asOfDate?: Date) {
    const date = asOfDate || new Date();

    const transactions = await this.transactionsRepository.find({
      where: {
        tenantId,
        transactionDate: () => `transactionDate <= '${date.toISOString()}'`,
      } as any,
    });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      asOfDate: date,
    };
  }

  async getDailySummary(tenantId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await this.findAll(tenantId, startOfDay, endOfDay);

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date,
      income,
      expenses,
      net: income - expenses,
      transactionCount: transactions.length,
    };
  }

  async getMonthlySummary(tenantId: string, month: Date) {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const transactions = await this.findAll(tenantId, startOfMonth, endOfMonth);

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory: Record<string, number> = {};
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
}
