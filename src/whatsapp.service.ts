import { Injectable } from '@nestjs/common';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService {
  private clients: Map<string, Client>;
  private qrCodes: Map<string, string>;

  constructor() {
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
      qrMaxRetries: 5,
      takeoverTimeoutMs: 60000,
      authTimeoutMs: 60000,
    };
    const client = new Client(options);

    client.on('qr', (qr) => {
      console.log('qr called');
      qrCallback(qr);
      this.qrCodes.set(userId, qr);
    });

    client.on('ready', () => {
      console.log('Client is ready!');
      readyCallback('Client is ready');
    });

    client.on('message', (msg) => {
      console.log(msg);
    });

    client.initialize();

    this.clients.set(userId, client);

    return 'success';
  }

  getClientForUser(userId: string): Client | undefined {
    return this.clients.get(userId);
  }

  getQrCodeForUser(userId: string): string | undefined {
    return this.qrCodes.get(userId);
  }
}
