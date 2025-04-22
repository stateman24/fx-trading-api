import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
    @ApiProperty({
        example: 'user@gmail.com',
        description: 'Email address of the user',
    })
    email: string;
    @ApiProperty({
        example: '123456',
        description: 'OTP code sent to the user',
    })
    otpCode: string;
}
