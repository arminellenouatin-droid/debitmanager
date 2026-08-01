import { User } from '../../users/entities/user.entity';
import { Schedule } from './schedule.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Payroll } from '../../payroll/entities/payroll.entity';
export declare enum PaymentMethod {
    MOBILE_MONEY = "MOBILE_MONEY",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH = "CASH"
}
export declare enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    ON_LEAVE = "ON_LEAVE",
    TERMINATED = "TERMINATED"
}
export declare class Employee {
    id: string;
    tenantId: string;
    userId: string;
    position: string;
    hourlyRate: number;
    monthlySalary: number;
    paymentMethod: PaymentMethod;
    paymentAccountRef: string;
    idDocumentUrl: string;
    contractDocumentUrl: string;
    status: EmployeeStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    user: User;
    schedules: Schedule[];
    attendances: Attendance[];
    payrolls: Payroll[];
}
