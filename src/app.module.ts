import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { typeOrmConfigAsync } from 'config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WalletModule } from './wallet/wallet.module';
import { TranscationsModule } from './transcations/transcations.module';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),
        AuthModule,
        MailModule,
        WalletModule,
        TranscationsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
