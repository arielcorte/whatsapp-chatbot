import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappGateway } from '../websocket/whatsapp.gateway';
import { ChatflowService } from './chatflow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wclient } from './wclient.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WclientController } from './wclient.controller';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([Wclient])],
  providers: [WhatsappService, WhatsappGateway, ChatflowService],
  controllers: [WclientController],
})
export class ChatbotModule {}
