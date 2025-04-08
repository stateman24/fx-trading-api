import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entitiy';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { fundWalletDto } from './dto/fundWallet.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    ) {}

    async getUserWallet(userId: string) {
        const wallet = await this.walletRepo.find({
            where: { user: { id: userId } },
        });
        if (!wallet) {
            throw new NotFoundException('Wallet not found');
        }
        return wallet;
    }

    async createDefaultWallets(user: User) {
        const currencies = ['NGN', 'USD', 'EUR'] as const;

        const wallets = currencies.map((currency) => {
            return this.walletRepo.create({
                user,
                currency,
                balance: currency === 'NGN' ? 100 : 0, // default NGN balance
            });
        });

        await this.walletRepo.save(wallets);
    }

    async fundWallet(userId: string, fundDto: fundWalletDto) {
        const wallet = await this.walletRepo.findOne({
            where: { user: { id: userId }, currency: fundDto.currency },
        });
        if (!wallet) {
            throw new NotFoundException('Wallet not found');
        }

        wallet.balance += fundDto.amount;
        return this.walletRepo.save(wallet);
    }
}
