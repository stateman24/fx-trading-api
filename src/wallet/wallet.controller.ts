/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { FundConversionDto } from './dto/conversion.dto';
import { TradeDto } from './dto/trade.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags()
@UseGuards(AuthGuard('jwt'))
@Controller('v1/wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @Get()
    @ApiOperation({ summary: 'Get user wallets and wallet balance' })
    @ApiResponse({
        status: 200,
        description: 'Returns a list of wallet balance',
    })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: 403, description: 'Forbidden' })
    getWallet(@Req() req: Request) {
        const userId: string = req['user'].id;
        if (!userId) {
            throw new NotFoundException('User not found');
        }
        const wallet = this.walletService.getUserWallet(userId);
        return wallet;
    }

    @Post('fund')
    @ApiOperation({ summary: 'Fund Wallet' })
    @ApiResponse({
        status: 200,
        description: 'Fund target wallet',
    })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: 403, description: 'Forbidden' })
    fundWallet(@Req() req: Request) {
        const userId: string = req['user'].id;
        const fundData: any = req.body;
        if (!userId) {
            throw new NotFoundException('User not found');
        }
        const wallet = this.walletService.fundWallet(userId, fundData);
        return wallet;
    }

    @Post('convert')
    @ApiOperation({ summary: 'Covert Funds from one wallet to another' })
    @ApiResponse({
        status: 201,
        description: 'Returns a fund conversion nofication ',
    })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: 403, description: 'Forbidden' })
    convert(@Req() req: Request, @Body() convertionData: FundConversionDto) {
        const userId: string = req['user'].id;
        const wallet = this.walletService.convertFunds(userId, convertionData);
        return wallet;
    }

    @Post('trade')
    @ApiOperation({ summary: 'Trade with wallet for a specific Currency Pair' })
    @ApiResponse({
        status: 201,
        description: 'Returns Trade Data',
        examples: {
            'application/json': {
                summary: 'Trade Data',
                value: {
                    id: '12345',
                    userId: '67890',
                    currencyPair: 'BTC/USDT',
                    amount: 0.5,
                    price: 50000,
                    status: 'completed',
                    createdAt: '2023-10-01T12:00:00Z',
                    updatedAt: '2023-10-01T12:00:00Z',
                },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: 403, description: 'Forbidden' })
    trade(@Req() req: Request, @Body() tradeData: TradeDto) {
        const userId: string = req['user'].id;
        const tradeResult = this.walletService.trade(userId, tradeData);
        return tradeResult;
    }
}
