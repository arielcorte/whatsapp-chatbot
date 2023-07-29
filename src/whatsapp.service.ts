import { Injectable } from '@nestjs/common';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';

import qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService {
  private clients: Map<string, Client>;

  constructor() {
    this.clients = new Map<string, Client>();
  }

  createClientForUser(userId: string) {
    if (!this.clients.has(userId)) {
      const options: ClientOptions = {};
      const client = new Client(options);

      client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
      });

      client.on('ready', () => {
        console.log('Client is ready!');
      });

      client.on('message', (msg) => {
        console.log(msg);
      });

      client.initialize();

      this.clients.set(userId, client);
    }
  }

  getClientForUser(userId: string): Client | undefined {
    return this.clients.get(userId);
  }
}
