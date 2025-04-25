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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, MailService],
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        WalletModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get<string>('jwt.secret'),
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AuthModule {}
