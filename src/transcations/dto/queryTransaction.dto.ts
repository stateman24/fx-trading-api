/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({ example: 'debit', description: 'Transaction type' })
    type?: 'debit' | 'credit';

    @IsOptional()
    @IsIn(['NGN', 'USD', 'EUR'])
    @ApiProperty({
        example: 'NGN',
        description: 'Currency used in transactions',
    })
    currency?: string;

    @IsOptional()
    @IsIn(['pending', 'success', 'failed'])
    @ApiProperty({ example: 'success', description: 'Transcations status' })
    status?: 'pending' | 'success' | 'failed';

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        example: Date.now().toString(),
        description: 'Time of transctions begins',
    })
    from?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        example: Date.now().toString(),
        description: 'Time of transctions end',
    })
    to?: string;

    @IsOptional()
    @IsNumberString()
    @Type(() => Number)
    @ApiProperty({
        example: '1',
        description: 'Page Number',
    })
    page: number = 1;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        example: '10',
        description: 'Number of transcations to return at once',
    })
    @Type(() => Number)
    limit: number = 10;
}
