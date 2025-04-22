import { IsEnum, IsNumber, Min } from 'class-validator';
import { Currency } from '../wallet.entitiy';
import { ApiProperty } from '@nestjs/swagger';

export class FundConversionDto {
    @IsEnum(Currency)
    @ApiProperty({ example: 'NGN', description: 'Source Wallet currency' })
    sourceCurrency: Currency;

    @ApiProperty({ example: 'USD', description: 'Targer Wallet currency' })
    @IsEnum(Currency)
    targetCurrency: Currency;

    @IsNumber()
    @Min(1)
    @ApiProperty({ example: '1000.00', description: 'Amount to convert' })
    amount: number;
}
