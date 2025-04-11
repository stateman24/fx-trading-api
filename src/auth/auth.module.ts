import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { User } from '../users/users.entity';
import { WalletModule } from '../wallet/wallet.module';
import { MailService } from '../mail/mail.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, MailService],
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        WalletModule,
    ],
})
export class AuthModule {}
