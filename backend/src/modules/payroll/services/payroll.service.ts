import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payroll, PayrollStatus } from '../entities/payroll.entity';
import { Employee } from '../entities/employee.entity';
import { CreatePayrollDto } from '../dto/create-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createPayrollDto: CreatePayrollDto, tenantId: string) {
    const { employeeId, startDate, endDate, baseSalary, hoursWorked, overtimeHours, bonuses, deductions, advances } = createPayrollDto;

    // Validate employee
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Calculate payroll
    const hourlyRate = baseSalary / 160; // Assuming 160 hours/month
    const regularPay = hoursWorked * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x for overtime
    const totalBonuses = bonuses || 0;
    const totalDeductions = deductions || 0;
    const totalAdvances = advances?.reduce((sum, a) => sum + a.amount, 0) || 0;

    const grossPay = regularPay + overtimePay + totalBonuses;
    const netPay = grossPay - totalDeductions - totalAdvances;

    const payroll = this.payrollRepository.create({
      tenantId,
      employeeId,
      startDate,
      endDate,
      baseSalary,
      hoursWorked,
      overtimeHours,
      regularPay,
      overtimePay,
      bonuses: totalBonuses,
      deductions: totalDeductions,
      advances: totalAdvances,
      grossPay,
      netPay,
      status: PayrollStatus.PENDING,
    });

    return this.payrollRepository.save(payroll);
  }

  async findAll(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };

    if (startDate && endDate) {
      where.startDate = () => `startDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
    }

    return this.payrollRepository.find({
      where,
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmployee(employeeId: string, tenantId: string) {
    return this.payrollRepository.find({
      where: { tenantId, employeeId },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: string, tenantId: string) {
    const payroll = await this.payrollRepository.findOne({
      where: { id, tenantId },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    await this.payrollRepository.update(id, {
      status: PayrollStatus.APPROVED,
      approvedAt: new Date(),
    });

    return this.payrollRepository.findOne({ where: { id } });
  }

  async processPayment(id: string, tenantId: string) {
    const payroll = await this.payrollRepository.findOne({
      where: { id, tenantId },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status !== PayrollStatus.APPROVED) {
      throw new Error('Payroll must be approved before payment');
    }

    await this.payrollRepository.update(id, {
      status: PayrollStatus.PAID,
      paidAt: new Date(),
    });

    return this.payrollRepository.findOne({ where: { id } });
  }

  async getPayrollSummary(tenantId: string, month: Date) {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const payrolls = await this.findAll(tenantId, startOfMonth, endOfMonth);

    const summary = {
      month,
      totalEmployees: payrolls.length,
      totalGrossPay: payrolls.reduce((sum, p) => sum + p.grossPay, 0),
      totalNetPay: payrolls.reduce((sum, p) => sum + p.netPay, 0),
      totalBonuses: payrolls.reduce((sum, p) => sum + p.bonuses, 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + p.deductions, 0),
      totalAdvances: payrolls.reduce((sum, p) => sum + p.advances, 0),
      pending: payrolls.filter(p => p.status === PayrollStatus.PENDING).length,
      approved: payrolls.filter(p => p.status === PayrollStatus.APPROVED).length,
      paid: payrolls.filter(p => p.status === PayrollStatus.PAID).length,
    };

    return summary;
  }
}
