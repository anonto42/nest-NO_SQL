import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, OtpUserDto, RefreshUserDto, VerifyOtpDto } from './auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    async register(@Body() registerDto: CreateUserDto) 
    {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginUserDto) 
    {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    async refresh(@Body() refreshDto: RefreshUserDto) 
    {
        return this.authService.refresh(refreshDto);
    }

    @Throttle({ default: { limit: 1, ttl: 60000 } })
    @Post('otp')
    async otp(@Body() otpDto: OtpUserDto) 
    {
        return this.authService.otp(otpDto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) 
    {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) 
    {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) 
    {
        return this.authService.changePassword(changePasswordDto);
    }
}
