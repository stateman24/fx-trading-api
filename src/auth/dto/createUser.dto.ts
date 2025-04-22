import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;
    @ApiProperty({ example: 'password123456' })
    password: string;
    @ApiProperty({ example: 'password123456' })
    repeatPassword: string;
    @ApiProperty({ example: 'John' })
    firstName: string;
    @ApiProperty({ example: 'Doe' })
    lastName: string;
}
