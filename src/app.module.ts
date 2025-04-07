import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { typeOrmConfigAsync } from 'config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),
        AuthModule,
        MailModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
