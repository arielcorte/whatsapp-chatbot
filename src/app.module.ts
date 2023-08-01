import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhoamiController } from './whoami.controller';
import { WhoamiService } from './whoami.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappGateway } from './websocket/whatsapp.gateway';
import { ChatflowService } from './chatflow.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, WhoamiController],
  providers: [
    AppService,
    WhoamiService,
    WhatsappService,
    WhatsappGateway,
    ChatflowService,
  ],
})
export class AppModule {}
