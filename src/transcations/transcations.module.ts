import { Module } from '@nestjs/common';
import { TranscationsService } from './transcations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transcations } from './transactions.entitiy';
import { TranscationsController } from './transcations.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Transcations])],
    providers: [TranscationsService],
    exports: [TranscationsService],
    controllers: [TranscationsController],
})
export class TranscationsModule {}
