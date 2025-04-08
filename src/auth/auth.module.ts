import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { JwtStrategy } from './jwt.stategy';
import { MailService } from 'src/mail/mail.service';
import { WalletModule } from 'src/wallet/wallet.module';

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
