import { Repository } from 'typeorm';
import { Payroll } from '../entities/payroll.entity';
import { Employee } from '../entities/employee.entity';
import { CreatePayrollDto } from '../dto/create-payroll.dto';
export declare class PayrollService {
    private payrollRepository;
    private employeesRepository;
    constructor(payrollRepository: Repository<Payroll>, employeesRepository: Repository<Employee>);
    create(createPayrollDto: CreatePayrollDto, tenantId: string): Promise<Payroll>;
    findAll(tenantId: string, startDate?: Date, endDate?: Date): Promise<Payroll[]>;
    findByEmployee(employeeId: string, tenantId: string): Promise<Payroll[]>;
    approve(id: string, tenantId: string): Promise<Payroll>;
    processPayment(id: string, tenantId: string): Promise<Payroll>;
    getPayrollSummary(tenantId: string, month: Date): Promise<{
        month: Date;
        totalEmployees: number;
        totalGrossPay: number;
        totalNetPay: number;
        totalBonuses: number;
        totalDeductions: number;
        totalAdvances: number;
        pending: number;
        approved: number;
        paid: number;
    }>;
}
