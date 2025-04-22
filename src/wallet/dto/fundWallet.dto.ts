import { IsDecimal, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class fundWalletDto {
    @IsEnum(['NGN', 'USD', 'EUR'], {
        message: 'Invalid currency',
    })
    @ApiProperty({ example: 'EUR', description: 'Currency Wallet to fund' })
    currency: 'NGN' | 'USD' | 'EUR';

    @IsDecimal()
    @Min(1)
    @ApiProperty({
        example: '1000.00',
        description: 'Amount to fund the wallet',
    })
    amount: number;
}
