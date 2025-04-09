/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TranscationsService } from './transcations.service';
import { QueryTranactionDto } from './dto/queryTransaction.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('transcations')
export class TranscationsController {
    constructor(private transactionService: TranscationsService) {}

    @Get()
    getUserTransactions(
        @Req() req: Request,
        @Query() query: QueryTranactionDto,
    ) {
        const userId: string = req['user'].id;
        return this.transactionService.getUserTransactions(userId, query);
    }
}
