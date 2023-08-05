import { Injectable } from '@nestjs/common';
import {
  Chat,
  Client,
  ClientOptions,
  LocalAuth,
  Message,
} from 'whatsapp-web.js';
import { ChatflowService } from './chatflow.service';

type HistoryFrom = 'apiMessage' | 'userMessage';

@Injectable()
export class WhatsappService {
  private clients: Map<string, Client>;
  private qrCodes: Map<string, string>;
  private timeouts: Map<string, NodeJS.Timeout>;
  private messages: Map<string, string>;

  constructor(private readonly chatflowService: ChatflowService) {
    this.clients = new Map<string, Client>();
    this.qrCodes = new Map<string, string>();
    this.timeouts = new Map<string, NodeJS.Timeout>();
    this.messages = new Map<string, string>();
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
      puppeteer: {
        //headless: false,
        args: ['--no-sandbox'],
        //browserWSEndpoint: process.env.BROWSER_URL,
      },
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

    client.on('message', async (msg: Message) => {
      if (msg.isStatus) return;
      const checkGroupArchived = await msg
        .getChat()
        .then((chat) => chat.isGroup || chat.archived);
      if (checkGroupArchived) return;
      if (
        msg.type === 'audio' ||
        msg.type === 'ptt' ||
        msg.type === 'image' ||
        msg.type === 'video' ||
        msg.type === 'document'
      ) {
        msg.reply(
          'Lo siento, soy una IA y por el momento no soy capaz de entender Audios, Imágenes, Videos, Documentos o Stickers. Por favor, ¿Podrías explicarme en texto? Muchas gracias 😊',
        );
      }

      if (msg.type === 'chat') {
        console.log(userId, msg.body);
        const chatTimeout = this.timeouts.get(userId + msg.from);
        console.log(chatTimeout);

        if (chatTimeout) {
          clearTimeout(chatTimeout);
          console.log('cleared chatTimeout');
        }

        const prevMessage = this.messages.get(userId + msg.from);

        this.messages.set(
          userId + msg.from,
          prevMessage ? prevMessage + ' ' + msg.body : msg.body,
        );

        console.log('message set');

        const currentTimeout = this.executeInDelay(async () => {
          const result = await this.chatflowService.query({
            question: this.messages.get(userId + msg.from),
            sessionId: msg.from,
          });
          console.log(msg.from, result);
          client.sendMessage(msg.from, result);
          this.timeouts.delete(userId + msg.from);
          this.messages.delete(userId + msg.from);
        });

        console.log('current timeout set');

        this.timeouts.set(userId + msg.from, currentTimeout);
      }
    });

    client.initialize();

    this.clients.set(userId, client);

    return 'success';
  }

  formatMessage(msg: string): string {
    return msg.replace(/\n/g, '[d(shift)]\n[u(shift)]');
  }

  async getHistory(msg: Message): Promise<string> {
    //Promise<{ type: HistoryFrom; message: string }[]>
    const chat = await msg.getChat();
    const history = await chat.fetchMessages({ limit: 2 });
    const formatted = history.slice(0, -1).map((msg) => {
      //if (msg.fromMe) {
      //  return { type: 'apiMessage' as HistoryFrom, message: msg.body };
      //}
      //return { type: 'userMessage' as HistoryFrom, message: msg.body };
      return msg.body;
    });
    return formatted.join(' ');
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

  executeInDelay(callback: () => void): NodeJS.Timeout {
    console.log('setting Timeout');
    return setTimeout(callback, 5000);
  }
}
