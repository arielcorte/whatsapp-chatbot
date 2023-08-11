import { Injectable } from '@nestjs/common';
import { Client, ClientOptions, LocalAuth, Message } from 'whatsapp-web.js';
import { ChatflowService } from './chatflow.service';

import emojiRegex from 'emoji-regex';

const agentKeyword = '@agente';

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
        //headless: true,
        args: ['--no-sandbox'],
        //browserWSEndpoint: process.env.BROWSER_URL,
      },
      qrMaxRetries: 5,
    };

    try {
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

      client.on('disconnected', () => {
        console.log('disconnected', userId);
        this.clients.delete(userId);
        this.qrCodes.delete(userId);
        this.deleteAllEntriesUserId(this.timeouts, userId);
        this.deleteAllEntriesUserId(this.messages, userId);
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
          if (msg.body.toLowerCase().includes(agentKeyword)) {
            this.requestAgent(msg);
          }
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
            prevMessage
              ? prevMessage + ' ' + this.removeEmojis(msg.body)
              : this.removeEmojis(msg.body),
          );

          console.log('message set');

          const currentTimeout = this.executeInDelay(async () => {
            this.messageCount();
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
    } catch (error) {
      console.error(error);
      return 'failed';
    }

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

  removeEmojis(inputString: string) {
    const emojiPattern = emojiRegex();

    return inputString.replace(emojiPattern, ' ').trim();
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

  getKeysForUserId(map: Map<string, any>, userId: string) {
    const filteredKeys = Array.from(map.keys()).filter((key) =>
      key.startsWith(userId),
    );
    return filteredKeys;
  }

  deleteAllEntriesUserId(map: Map<string, any>, userId: string) {
    for (const key of this.getKeysForUserId(map, userId)) {
      map.delete(key);
    }
  }

  executeInDelay(callback: () => void): NodeJS.Timeout {
    console.log('setting Timeout');
    return setTimeout(callback, 7000);
  }

  requestAgent(msg: Message) {
    msg.getChat().then((chat) => {
      chat.archive;
      chat.sendMessage(
        '¡Perfecto! En la brevedad un agente se pondrá en contacto con usted. Por favor, ¿Podría solicitarme los siguientes datos? - Nombre y apellido - Email - Producto en el que está interesado - Presupuesto estimado. ¡Muchas Gracias!',
      );
      chat.markUnread();
    });
  }

  messageCount() {
    //TODO increment message count by 1
  }
}
