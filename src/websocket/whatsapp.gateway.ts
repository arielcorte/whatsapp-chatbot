import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WhatsappService } from '../whatsapp.service';
import UserAPIs from '../../userapis.json';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WhatsappGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly whatsappService: WhatsappService) {}

  handleConnection(socket: Socket) {
    console.log('Client connected: ', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected: ', socket.id);
  }

  @SubscribeMessage('new-client')
  newClient(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    console.log(userId);
    client.emit(
      'new-client',
      this.whatsappService.createClientForUser({
        userId,
        qrCallback: (qr) => client.emit('qr-code', qr),
        readyCallback: (msg) => client.emit('ready', msg),
        clientApi: UserAPIs[userId] || undefined,
        clientKey: UserAPIs[userId] || undefined,
      }),
    );
  }

  @SubscribeMessage('qr-code')
  getQrCode(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.emit('qr-code', this.whatsappService.getQrCodeForUser(userId));
  }

  @SubscribeMessage('delete-client')
  deleteClient(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit(
      'delete-client',
      this.whatsappService.deleteClientForUser(userId),
    );
  }
}
