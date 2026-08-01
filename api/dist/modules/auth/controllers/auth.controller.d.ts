import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { RefreshDto } from '../dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    sendOtp(sendOtpDto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
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
        };
    }>;
    refresh(refreshDto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}
