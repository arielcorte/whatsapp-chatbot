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

  sendQr(client: Socket, qr: string) {
    console.log('sending qr');
    client.emit('qr-code', qr);
  }

  @SubscribeMessage('new-client')
  newClient(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('new-client in progress...');
    client.emit(
      'new-client',
      this.whatsappService.createClientForUser(userId, (qr) =>
        this.sendQr(client, qr),
      ),
    );
  }

  @SubscribeMessage('qr-code')
  getQrCode(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('qr-code', this.whatsappService.getQrCodeForUser(userId));
  }
}
