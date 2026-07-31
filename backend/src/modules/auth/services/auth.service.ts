import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserType, UserStatus } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { IAuthService } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phone, email } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ phone }, ...(email ? [{ email }] : [])],
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.usersRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      email: registerDto.email,
      passwordHash,
      userType: registerDto.userType as any,
      status: UserStatus.PENDING_VALIDATION,
      twoFactorEnabled: false,
    });

    await this.usersRepository.save(user);

    // Send OTP for phone verification
    await this.sendOtp({ phone });

    return {
      message: 'User registered successfully. Please verify your phone number.',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('Account is suspended or deleted');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.usersRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    // TODO: Integrate with SMS gateway to send OTP
    // For now, log the OTP (in production, send via SMS)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`OTP for ${phone}: ${otp}`);

    // TODO: Store OTP in Redis with expiration
    // await this.redisService.set(`otp:${phone}`, otp, 300); // 5 minutes

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    // TODO: Verify OTP from Redis
    // const storedOtp = await this.redisService.get(`otp:${phone}`);
    // if (storedOtp !== code) {
    //   throw new UnauthorizedException('Invalid OTP');
    // }

    // For now, accept any 4-digit code
    if (code.length !== 4) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Find user by phone
    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update user status to active
    await this.usersRepository.update(user.id, {
      status: UserStatus.ACTIVE,
    });

    return { message: 'Phone verified successfully' };
  }

  async refreshTokens(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // TODO: Add token to blacklist in Redis
    // await this.redisService.set(`blacklist:${token}`, '1', tokenExpiry);
    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User) {
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

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
