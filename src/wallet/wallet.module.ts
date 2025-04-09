import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entitiy';
import { TranscationsModule } from 'src/transcations/transcations.module';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet]), TranscationsModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
