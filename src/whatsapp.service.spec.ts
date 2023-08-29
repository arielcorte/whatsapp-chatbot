import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { AppService } from './app.service';
import { WhoamiService } from './whoami.service';
import { WhatsappGateway } from './websocket/whatsapp.gateway';
import { ChatflowService } from './chatflow.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { WhoamiController } from './whoami.controller';

describe('WhatsappController', () => {
  let whatsappService: WhatsappService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [AppController, WhoamiController],
      providers: [
        AppService,
        WhoamiService,
        WhatsappService,
        WhatsappGateway,
        ChatflowService,
      ],
    }).compile();

    whatsappService = app.get<WhatsappService>(WhatsappService);
  });

  describe('Client parser', () => {
    it('should return "http://flowise:3000/api"', () => {
      expect(
        whatsappService.parseClientApi({
          url: 'http://123.123.12.12:3000/api',
          key: 'key',
        }),
      ).toStrictEqual({
        url: '/api',
        key: 'key',
      });
    });
  });
});
