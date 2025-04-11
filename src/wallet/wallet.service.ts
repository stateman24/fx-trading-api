import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entitiy';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { fundWalletDto } from './dto/fundWallet.dto';
import { Transcations } from '../transcations/transactions.entitiy';
import { FundConversionDto } from './dto/conversion.dto';
import { exchangeRateService } from '../utils/exchangeRate.utils';
import Decimal from 'decimal.js';
import { TradeDto } from './dto/trade.dto';
import { Trade } from './trade.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
        private dataSource: DataSource,
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
        const { currency, amount } = fundDto;
        if (!wallet) {
            throw new NotFoundException('Wallet not found');
        }
        await this.dataSource.transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .update(Wallet)
                .set({
                    balance: () => `"balance" + ${amount}`,
                })
                .where('userId = :userId', { userId })
                .andWhere('currency = :currency', { currency })
                .execute();

            // Save transaction record
            await manager.save(Transcations, {
                userId,
                currency,
                amount,
                type: 'credit',
                status: 'success',
            });
        });

        return { message: 'Wallet funded successfully' };
    }

    // convert fund from one wallet to another
    async convertFunds(userId: string, conversionDto: FundConversionDto) {
        const { sourceCurrency, targetCurrency, amount } = conversionDto;
        // get the converted amonunt
        const convertedAmount = await exchangeRateService.convertCurrency(
            amount,
            sourceCurrency,
            targetCurrency,
        );
        console.log(convertedAmount);
        const sourceWallet = await this.walletRepo.findOne({
            where: { user: { id: userId }, currency: sourceCurrency },
        });
        const targetWallet = await this.walletRepo.findOne({
            where: { user: { id: userId }, currency: targetCurrency },
        });

        if (!sourceWallet)
            throw new NotFoundException('Source Wallet not Found');
        if (!targetWallet)
            throw new NotFoundException('Targer Wallet not Found');
        if (sourceWallet.balance < amount)
            throw new NotFoundException('Insufficient balance');
        return this.walletRepo.manager.transaction(
            async (transactionEntityManager) => {
                const sourceBalance = new Decimal(sourceWallet.balance);
                const targetBalance = new Decimal(targetWallet.balance);
                const amonunt = new Decimal(amount);
                const amountConvert = new Decimal(convertedAmount);

                sourceWallet.balance = sourceBalance.minus(amonunt).toNumber();
                targetWallet.balance = targetBalance
                    .plus(amountConvert)
                    .toNumber();

                await transactionEntityManager.save(sourceWallet);
                await transactionEntityManager.save(targetWallet);

                await transactionEntityManager.save(Transcations, {
                    userId,
                    currency: sourceCurrency,
                    amount,
                    type: 'debit',
                    status: 'success',
                });

                await transactionEntityManager.save(Transcations, {
                    userId,
                    currency: targetCurrency,
                    amount: convertedAmount,
                    type: 'credit',
                    status: 'success',
                });
                return { message: 'Funds converted successfully' };
            },
        );
    }

    // trade with wallet
    async trade(userId: string, tradeData: TradeDto) {
        const { sourceCurrency, targetCurrency, amount } = tradeData;
        if (sourceCurrency == targetCurrency) {
            throw new BadRequestException(
                'Source and target currency cannot be the same',
            );
        }
        const pairRate = await exchangeRateService.getExchangeRatePair(
            sourceCurrency,
            targetCurrency,
        );

        const convertAmmount = amount * pairRate;
        const sourceWallet = await this.walletRepo.findOneOrFail({
            where: { user: { id: userId }, currency: sourceCurrency },
        });
        const targetWallet = await this.walletRepo.findOneOrFail({
            where: { user: { id: userId }, currency: targetCurrency },
        });
        if (!sourceWallet && !targetWallet)
            throw new NotFoundException('Wallet not found');
        if (sourceWallet.balance < amount)
            throw new BadRequestException('Insufficent Funds');
        return this.walletRepo.manager.transaction(async (manager) => {
            const transactionRepo = manager.getRepository(Transcations);
            const tradeRepo = manager.getRepository(Trade);

            const sourceBalance = new Decimal(sourceWallet.balance);
            const targetBalance = new Decimal(targetWallet.balance);
            const amonunt = new Decimal(amount);
            const tradeAmount = new Decimal(convertAmmount);

            sourceWallet.balance = sourceBalance.minus(amonunt).toNumber();
            targetWallet.balance = targetBalance.plus(tradeAmount).toNumber();

            await manager.save(sourceWallet);
            await manager.save(targetWallet);

            await transactionRepo.save([
                {
                    userId,
                    currency: sourceCurrency,
                    amount,
                    type: 'debit',
                    status: 'success',
                    description: `Traded to ${targetCurrency}`,
                },
                {
                    userId,
                    currency: targetCurrency,
                    amount: convertAmmount,
                    type: 'credit',
                    status: 'success',
                    description: `Received from trading ${sourceCurrency}`,
                },
            ]);

            const trade = await tradeRepo.save({
                userId,
                sourceCurrency,
                targetCurrnecy: targetCurrency,
                amount,
                rate: pairRate,
            });
            return {
                message: `Trade successful for ${sourceCurrency}${targetCurrency} trade pair`,
                data: trade,
            };
        });
    }
}
