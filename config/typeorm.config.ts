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
        host: configService.get('database.db_host'),
        port: configService.get('database.db_port'),
        username: configService.get('database.db_username'),
        password: configService.get('database.db_password'),
        database: configService.get('database.db_name'),
        entities: [User, Wallet, Transcations, Trade],
        synchronize: true,
        logging: true,
    }),
};
