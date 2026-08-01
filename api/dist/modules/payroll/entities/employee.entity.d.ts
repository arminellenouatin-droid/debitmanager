export declare enum EmployeeRole {
    SERVER = "SERVER",
    BARTENDER = "BARTENDER",
    COOK = "COOK",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN"
}
export declare enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ON_LEAVE = "ON_LEAVE"
}
export declare class Employee {
    id: string;
    tenantId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    hireDate: Date;
    hourlyRate: number;
    monthlySalary: number;
    createdAt: Date;
    updatedAt: Date;
}
