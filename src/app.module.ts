import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { typeOrmConfigAsync } from '../config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WalletModule } from './wallet/wallet.module';
import { TranscationsModule } from './transcations/transcations.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),
        AuthModule,
        MailModule,
        WalletModule,
        TranscationsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            load: [configuration],
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60,
                    limit: 10,
                },
            ],
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
