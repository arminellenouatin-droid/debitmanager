export declare class CreatePayrollDto {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    baseSalary: number;
    hoursWorked: number;
    overtimeHours: number;
    bonuses?: number;
    deductions?: number;
    advances?: Array<{
        amount: number;
        date: Date;
        reason: string;
    }>;
}
