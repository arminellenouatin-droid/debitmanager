"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { phone, email } = registerDto;
        const existingUser = await this.usersRepository.findOne({
            where: [{ phone }, ...(email ? [{ email }] : [])],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const user = this.usersRepository.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phone: registerDto.phone,
            email: registerDto.email,
            passwordHash,
            userType: registerDto.userType,
            status: user_entity_1.UserStatus.PENDING_VALIDATION,
            twoFactorEnabled: false,
        });
        await this.usersRepository.save(user);
        await this.sendOtp({ phone });
        return {
            message: 'User registered successfully. Please verify your phone number.',
            userId: user.id,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === user_entity_1.UserStatus.SUSPENDED || user.status === user_entity_1.UserStatus.DELETED) {
            throw new common_1.UnauthorizedException('Account is suspended or deleted');
        }
        const tokens = await this.generateTokens(user);
        await this.usersRepository.update(user.id, {
            lastLoginAt: new Date(),
        });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async sendOtp(sendOtpDto) {
        const { phone } = sendOtpDto;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(`OTP for ${phone}: ${otp}`);
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(verifyOtpDto) {
        const { phone, code } = verifyOtpDto;
        if (code.length !== 4) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        const user = await this.usersRepository.findOne({ where: { phone } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.usersRepository.update(user.id, {
            status: user_entity_1.UserStatus.ACTIVE,
        });
        return { message: 'Phone verified successfully' };
    }
    async refreshTokens(refreshDto) {
        const { refreshToken } = refreshDto;
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersRepository.findOne({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const tokens = await this.generateTokens(user);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    async validateUser(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user || user.status !== user_entity_1.UserStatus.ACTIVE) {
            return null;
        }
        return this.sanitizeUser(user);
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            userType: user.userType,
            tenantId: user.tenantId,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    sanitizeUser(user) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map