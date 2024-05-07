// src/gateway/app.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(4000, { cors: 'localhost:3000' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}
  private hashTable = new Map();

  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendData')
  Hashing(client: Socket, data: any) {
    const MemberID = this.jwtService.decode(data.token).id;
    this.hashTable.set(MemberID, data.socketId);
  }

  wakeup(message: any) {
    if (!this.hashTable.has(message)) {
      throw new Error('에러발생');
    }
    const socketId = this.hashTable.get(message);

    this.server.to(socketId).emit('wakeup', 'hello');
  }
}
