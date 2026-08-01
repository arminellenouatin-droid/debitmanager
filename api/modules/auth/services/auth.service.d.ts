import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserType, UserStatus } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { IAuthService } from '../interfaces/auth.service.interface';
export declare class AuthService implements IAuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            tenantId: string;
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
            userType: UserType;
            roleId: string;
            status: UserStatus;
            twoFactorEnabled: boolean;
            lastLoginAt: Date;
            lastLoginIp: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            employee?: import("../../employees/entities/employee.entity").Employee;
            affiliate?: import("../../affiliates/entities/affiliate.entity").Affiliate;
        };
    }>;
    sendOtp(sendOtpDto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    refreshTokens(refreshDto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        userType: UserType;
        roleId: string;
        status: UserStatus;
        twoFactorEnabled: boolean;
        lastLoginAt: Date;
        lastLoginIp: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        employee?: import("../../employees/entities/employee.entity").Employee;
        affiliate?: import("../../affiliates/entities/affiliate.entity").Affiliate;
    }>;
    private generateTokens;
    private sanitizeUser;
}
