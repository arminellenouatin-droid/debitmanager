import { Employee } from './employee.entity';
export declare enum PayrollStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    PAID = "PAID"
}
export declare class Payroll {
    id: string;
    tenantId: string;
    employeeId: string;
    employee: Employee;
    startDate: Date;
    endDate: Date;
    baseSalary: number;
    hoursWorked: number;
    overtimeHours: number;
    regularPay: number;
    overtimePay: number;
    bonuses: number;
    deductions: number;
    advances: number;
    grossPay: number;
    netPay: number;
    status: PayrollStatus;
    approvedAt: Date;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
