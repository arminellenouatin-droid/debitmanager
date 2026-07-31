import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { RefreshDto } from '../dto/refresh.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<any>;
  login(loginDto: LoginDto): Promise<any>;
  sendOtp(sendOtpDto: SendOtpDto): Promise<any>;
  verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any>;
  refreshTokens(refreshDto: RefreshDto): Promise<any>;
  logout(userId: string): Promise<any>;
  validateUser(userId: string): Promise<any>;
}
