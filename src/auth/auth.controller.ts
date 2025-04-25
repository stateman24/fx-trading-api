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

    // User Sign up
    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        examples: {
            'application/json': {
                summary: 'Registration Message',
                value: {
                    message: 'Verification OTP sent to your email',
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        examples: {
            'application/json': {
                summary: 'Internal Server Error',
                value: {
                    statusCode: 500,
                    message: 'Internal server error',
                },
            },
        },
    })
    register(@Body() registerData: CreateUserDto) {
        if (!registerData) {
            throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
        }
        return this.auhService.register(registerData);
    }

    // User login
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        examples: {
            'application/json': {
                summary: 'User Login',
                value: {
                    user: {
                        id: '1c3290be-8c51-4697-b87d-88c748dc863a',
                        email: 'example@gmail.com',
                        password:
                            '$2b$10$GHz1ajtyUfA/9lGJ307wFu3itT0F9DeYWw0samHNjDzXgqUXwWATG',
                        firstName: 'example1',
                        lastName: 'exmaple2',
                        emailOtp: null,
                        expireOtp: null,
                        isActive: true,
                        createdAt: '2025-04-23T18:52:58.889Z',
                        updatedAt: '2025-04-23T18:52:58.889Z',
                    },
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYzMyOTBiZS04YzUxLTQ2OTctYjg3ZC04OGM3NDhkYzg2M2EiLCJlbWFpbCI6ImFqaWJld2FkYW5ueWJvaUBnbWFpbC5jb20iLCJpYXQiOjE3NDU2MDczNjYsImV4cCI6MTc0NTYwODI2Nn0.Qqb_50YsvXZ6oQbfE2Q5S-udIV4jrMHd_m2CL9gtpfo',
                    refreshToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYzMyOTBiZS04YzUxLTQ2OTctYjg3ZC04OGM3NDhkYzg2M2EiLCJlbWFpbCI6ImFqaWJld2FkYW5ueWJvaUBnbWFpbC5jb20iLCJpYXQiOjE3NDU2MDczNjYsImV4cCI6MTc0NjIxMjE2Nn0.I0ZGEn7NXRAUtVzycK40pcbLCGzBjTvacIXh1zUUCwc',
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Interal Server Error',
        examples: {
            'application/json': {
                summary: 'Server Error',
                value: {
                    statusCode: 500,
                    message: 'Internal server error',
                },
            },
        },
    })
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
        examples: {
            'application/json': {
                summary: 'Resend OTP',
                value: {
                    message: 'Verification OTP sent to your email',
                },
            },
        },
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
