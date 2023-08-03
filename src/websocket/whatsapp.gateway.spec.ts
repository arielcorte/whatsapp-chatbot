import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappGateway } from './whatsapp.gateway';

describe('WhatsappGateway', () => {
  let gateway: WhatsappGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappGateway],
    }).compile();

    gateway = module.get<WhatsappGateway>(WhatsappGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
