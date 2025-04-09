/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsIn,
    IsNumberString,
    IsOptional,
} from 'class-validator';

export class QueryTranactionDto {
    @IsOptional()
    @IsIn(['debit', 'credit'])
    type?: 'debit' | 'creadit';

    @IsOptional()
    @IsIn(['NGN', 'USD', 'EUR'])
    currency?: string;

    @IsOptional()
    @IsIn(['pending', 'success', 'failed'])
    status?: 'pending' | 'sucess' | 'failed';

    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;

    @IsOptional()
    @IsNumberString()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsNumberString()
    @Type(() => Number)
    limit: number = 10;
}
