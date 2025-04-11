import { IsEnum, IsNumber, Min } from 'class-validator';
import { Currency } from '../wallet.entitiy';

export class TradeDto {
    @IsEnum(Currency)
    sourceCurrency: Currency;

    @IsEnum(Currency)
    targetCurrency: Currency;

    @IsNumber()
    @Min(1)
    amount: number;
}
