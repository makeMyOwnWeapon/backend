// src/gateway/app.gateway.ts
import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway(4000, { cors: 'localhost:3000', })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private jwtService: JwtService,
  ) {}
  private hashTable = new Map();

  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendData')
  Hashing(client:Socket, data:any){
   const MemberID = this.jwtService.decode(data.token).id;
   this.hashTable.set(MemberID, data.socketId);
   console.log(this.hashTable);

   
  }

  wakeup(message:any){
    console.log(message);
    this.server.to(message).emit('wakeup','hello');
  }

 
  listAllClients() {
      const clients = Array.from(this.server.of('/').sockets.keys());
      console.log('Connected clients:', clients);
  }
  
}