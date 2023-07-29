import { Controller, Get, Param } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('user')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get(':userId/init')
  initializeClientForUser(@Param('userId') userId: string): string {
    this.whatsappService.createClientForUser(userId);
    return 'Client initialized for user: ' + userId;
  }

  @Get(':userId/send/message')
  sendMessageToUser(
    @Param('userId') userId: string,
    @Param('message') message: string,
  ): string {
    const client = this.whatsappService.getClientForUser(userId);
    if (!client) {
      return 'Client not initialized for user: ' + userId;
    }

    //client.sendMessage('---@c.us', message);

    return 'Message sent to user: ' + userId;
  }
}
