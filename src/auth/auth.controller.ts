import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';

@Controller('auth')
export class AuthController {
    constructor(private auhService: AuthService) {}
    @Post('register')
    register(@Body() registerData: CreateUserDto) {
        if (!registerData) {
            throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
        }
        return this.auhService.register(registerData);
    }

    @Post('login')
    login(@Body() loginData: LoginUserDto) {
        return this.auhService.login(loginData);
    }

    @Post('verify-email')
    verifyEmail(@Body() emailData: VerifyEmailDto) {
        if (!emailData) {
            throw new HttpException(
                'Provide OTP token',
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.auhService.verifyEmailOtp(emailData);
    }

    @Post('resend-otp')
    resendOtp(@Body() emailDto: { emailData: string }) {
        if (!emailDto) {
            throw new HttpException(
                'Provide OTP token',
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.auhService.resendOtp(emailDto);
    }
}
