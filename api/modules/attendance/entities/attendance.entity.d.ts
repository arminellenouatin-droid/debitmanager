import { Employee } from '../../employees/entities/employee.entity';
export declare enum AttendanceStatus {
    ON_TIME = "ON_TIME",
    LATE = "LATE",
    ABSENT = "ABSENT",
    EXCEPTION = "EXCEPTION"
}
export declare class Attendance {
    id: string;
    employeeId: string;
    tenantId: string;
    checkInAt: Date;
    checkInLat: number;
    checkInLng: number;
    status: AttendanceStatus;
    exceptionReason: string;
    exceptionGrantedByUserId: string;
    checkOutAt: Date;
    createdAt: Date;
    employee: Employee;
}
