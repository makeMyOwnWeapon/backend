import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(4000, { cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private hashTable = new Map();

  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}
  

  @WebSocketServer() server: Server;

  @OnEvent('lectureHistory.created')
  handleLectureHistoryCreated(payload: any) {
    if (this.hashTable.has(payload.memberId)) {
      const existingInfo = this.hashTable.get(payload.memberId);
      const updatedInfo = {
        ...existingInfo,
        lectureHistoryId: payload.lectureHistoryId
      };
      this.hashTable.set(payload.memberId, updatedInfo);
      console.log('Hash Table Updated with Lecture History:', this.hashTable);
    } else {
      console.log('Member ID not found in hashTable when trying to add lectureHistoryId');
    }
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendData')
  Hashing(client: Socket, data: any) {
    const memberId = this.jwtService.decode(data.token).id;
    const connectionInfo = {
      socketId: data.socketId,
      subLectureId: data.subLectureId,
    };
    this.hashTable.set(memberId, connectionInfo);
    this.eventEmitter.emit('member.connection', {
      memberId,
      ...connectionInfo,
    });
  }


  wakeup(message: any) {
    if (!this.hashTable.has(message)) {
      throw new Error('에러발생');
    }
    const connectionInfo = this.hashTable.get(message);
    console.log('Sending wakeup to:', connectionInfo.socketId);
    this.server.to(connectionInfo.socketId).emit('wakeup', 'hello');
  }
}
