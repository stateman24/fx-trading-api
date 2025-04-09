/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';
import { Transcations } from './transactions.entitiy';
import { QueryTranactionDto } from './dto/queryTransaction.dto';

@Injectable()
export class TranscationsService {
    constructor(
        @InjectRepository(Transcations)
        private transactionsRepo: Repository<Transcations>,
    ) {}

    async createTransaction(
        userId: string,
        currency: string,
        amonunt: number,
        type: 'debit' | 'credit',
        transactionEntityManger: EntityManager,
    ) {
        const transaction = new Transcations();
        transaction.userId = userId;
        transaction.currency = currency;
        transaction.amount = amonunt;
        transaction.type = type;
        transaction.status = 'success';
        return transactionEntityManger.save(transaction);
    }

    async getUserTransactions(userId: string, query: QueryTranactionDto) {
        const { type, currency, from, to, page, limit } = query;
        const where: any = { userId };
        if (type) where.type = type;
        if (currency) where.currency = currency;
        if (from && to) {
            where.createdAt = Between(new Date(from), new Date(to));
        }

        const [data, total] = await this.transactionsRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            page,
            limit,
            total,
            data,
        };
    }
}
