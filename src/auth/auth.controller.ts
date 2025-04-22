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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags()
@Controller('v1/auth')
export class AuthController {
    constructor(private auhService: AuthService) {}
    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'Conflict' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    register(@Body() registerData: CreateUserDto) {
        if (!registerData) {
            throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
        }
        return this.auhService.register(registerData);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    login(@Body() loginData: LoginUserDto) {
        return this.auhService.login(loginData);
    }

    @Post('verify')
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
    @ApiOperation({ summary: 'Resend OTP' })
    @ApiResponse({
        status: 200,
        description: 'OTP resent successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
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
