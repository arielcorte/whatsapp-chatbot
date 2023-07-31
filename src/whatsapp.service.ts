import { Injectable } from '@nestjs/common';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';
import { ChatflowService } from './chatflow.service';

@Injectable()
export class WhatsappService {
  private clients: Map<string, Client>;
  private qrCodes: Map<string, string>;

  constructor(private readonly chatflowService: ChatflowService) {
    this.clients = new Map<string, Client>();
    this.qrCodes = new Map<string, string>();
  }

  createClientForUser({
    userId,
    qrCallback,
    readyCallback,
  }: {
    userId: string;
    qrCallback: (qr: string) => void;
    readyCallback: (message: string) => void;
  }) {
    if (this.clients.has(userId)) return 'user already created';

    const options: ClientOptions = {
      authStrategy: new LocalAuth({ clientId: userId }),
      qrMaxRetries: 5,
    };
    const client = new Client(options);

    client.on('qr', (qr) => {
      console.log('qr called');
      qrCallback(qr);
      this.qrCodes.set(userId, qr);
    });

    client.on('ready', () => {
      console.log('Client is ready!');
      readyCallback('ready');
    });

    client.on('message', (msg) => {
      console.log(userId, msg.body);
      this.chatflowService
        .query({ question: msg.body, sessionId: msg.from })
        .then((json) => {
          console.log(json);
        });
    });

    client.initialize();

    this.clients.set(userId, client);

    return 'success';
  }

  getClientForUser(userId: string): Client | undefined {
    return this.clients.get(userId);
  }

  deleteClientForUser(userId: string): boolean {
    return this.clients.delete(userId);
  }

  getQrCodeForUser(userId: string): string | undefined {
    return this.qrCodes.get(userId);
  }
}
