/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Controller,
    Get,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @Get()
    getWallet(@Req() req: Request) {
        const userId: string = req['user'].id;
        if (!userId) {
            throw new NotFoundException('User not found');
        }
        const wallet = this.walletService.getUserWallet(userId);
        return wallet;
    }

    @Post('fund')
    fundWallet(@Req() req: Request) {
        const userId: string = req['user'].id;
        const fundData: any = req.body;
        if (!userId) {
            throw new NotFoundException('User not found');
        }
        const wallet = this.walletService.fundWallet(userId, fundData);
        return wallet;
    }
}
