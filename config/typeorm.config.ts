// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../src/users/users.entity';
import { Wallet } from '../src/wallet/wallet.entitiy';
import { Transcations } from '../src/transcations/transactions.entitiy';
import { Trade } from '../src/wallet/trade.entity';

export const typeOrmConfigAsync = {
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Wallet, Transcations, Trade],
        synchronize: true,
        logging: true,
    }),
};
