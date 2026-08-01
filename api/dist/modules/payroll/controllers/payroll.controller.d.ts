import { PayrollService } from '../services/payroll.service';
import { CreatePayrollDto } from '../dto/create-payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    create(createPayrollDto: CreatePayrollDto, tenantId: string): Promise<import("../entities/payroll.entity").Payroll>;
    findAll(tenantId: string, startDate?: string, endDate?: string): Promise<import("../entities/payroll.entity").Payroll[]>;
    findByEmployee(employeeId: string, tenantId: string): Promise<import("../entities/payroll.entity").Payroll[]>;
    getSummary(tenantId: string, month?: string): Promise<{
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
    approve(id: string, tenantId: string): Promise<import("../entities/payroll.entity").Payroll>;
    processPayment(id: string, tenantId: string): Promise<import("../entities/payroll.entity").Payroll>;
}
