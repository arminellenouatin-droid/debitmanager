import { Employee } from './employee.entity';
export declare enum DayOfWeek {
    MON = "MON",
    TUE = "TUE",
    WED = "WED",
    THU = "THU",
    FRI = "FRI",
    SAT = "SAT",
    SUN = "SUN"
}
export declare class Schedule {
    id: string;
    employeeId: string;
    dayOfWeek: DayOfWeek;
    startTime: Date;
    endTime: Date;
    exceptionDate: Date;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
}
