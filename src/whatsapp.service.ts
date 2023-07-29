import { Injectable } from '@nestjs/common';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';

import qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService {
  private client: Client;

  constructor() {
    const config: ClientOptions = {
      authStrategy: new LocalAuth(),
    };

    this.client = new Client(config);

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Client is ready');
    });

    this.client.on('message', (msg) => {
      console.log(msg.body);
    });

    this.client.initialize();
  }
}
