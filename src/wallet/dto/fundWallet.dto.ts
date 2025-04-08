/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDecimal, IsEnum, Min } from 'class-validator';

export class fundWalletDto {
    @IsEnum(['NGN', 'USD', 'EUR'], {
        message: 'Invalid currency',
    })
    currency: 'NGN' | 'USD' | 'EUR';

    @IsDecimal()
    @Min(1)
    amount: number;
}
