import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
        id: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        userType: import("../../users/entities/user.entity").UserType;
        roleId: string;
        status: import("../../users/entities/user.entity").UserStatus;
        twoFactorEnabled: boolean;
        lastLoginAt: Date;
        lastLoginIp: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        employee?: import("../../employees/entities/employee.entity").Employee;
        affiliate?: import("../../affiliates/entities/affiliate.entity").Affiliate;
    }>;
}
export {};
