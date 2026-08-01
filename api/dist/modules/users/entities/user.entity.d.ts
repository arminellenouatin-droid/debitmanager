import { Employee } from '../../employees/entities/employee.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
export declare enum UserType {
    TENANT_STAFF = "TENANT_STAFF",
    SUPER_ADMIN = "SUPER_ADMIN",
    AFFILIATE = "AFFILIATE"
}
export declare enum UserStatus {
    PENDING_VALIDATION = "PENDING_VALIDATION",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    DELETED = "DELETED"
}
export declare class User {
    id: string;
    tenantId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    passwordHash: string;
    userType: UserType;
    roleId: string;
    status: UserStatus;
    twoFactorEnabled: boolean;
    lastLoginAt: Date;
    lastLoginIp: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    employee?: Employee;
    affiliate?: Affiliate;
}
