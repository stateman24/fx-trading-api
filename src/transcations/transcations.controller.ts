/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TranscationsService } from './transcations.service';
import { QueryTranactionDto } from './dto/queryTransaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/transcations')
@ApiTags()
export class TranscationsController {
    constructor(private transactionService: TranscationsService) {}

    @Get()
    @ApiOperation({ summary: 'Get User Transactions' })
    @ApiResponse({
        status: 200,
        description: 'Returns a list of transactions based on provided query',
    })
    @ApiResponse({ status: 400, description: 'Transactions not found' })
    getUserTransactions(
        @Req() req: Request,
        @Query() query: QueryTranactionDto,
    ) {
        const userId: string = req['user'].id;
        return this.transactionService.getUserTransactions(userId, query);
    }
}
