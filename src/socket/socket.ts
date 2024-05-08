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
  private hashTable = new Map<number, any>();

  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}
  
  @WebSocketServer() server: Server;

  @OnEvent('lectureHistory.created')
  handleLectureHistoryCreated(payload: any) {
    const memberIdNum = Number(payload.memberId);
    if (this.hashTable.has(memberIdNum)) {
      const existingInfo = this.hashTable.get(memberIdNum);
      const updatedInfo = {
        ...existingInfo,
        lectureHistoryId: payload.lectureHistoryId
      };
      this.hashTable.set(memberIdNum, updatedInfo);
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
    const memberId = Number(this.jwtService.decode(data.token).id);
    const connectionInfo = {
      socketId: data.socketId,
      subLectureId: Number(data.subLectureId),
    };
    this.hashTable.set(memberId, connectionInfo);
    this.eventEmitter.emit('member.connection', {
      memberId,
      ...connectionInfo,
    });
  }

  wakeup(message: any) {
    const memberIdNum = Number(message);
    if (!this.hashTable.has(memberIdNum)) {
      throw new Error('에러발생');
    }
    const connectionInfo = this.hashTable.get(memberIdNum);
    console.log('Sending wakeup to:', connectionInfo.socketId);
    this.server.to(connectionInfo.socketId).emit('wakeup', 'hello');
  }

  getLectureHistoryId(memberId: string): number | undefined {
    const memberIdNum = Number(memberId);
    console.log("Fetching lecture history ID for memberId:", memberIdNum);
    console.log("Current hash table state:", this.hashTable);
  
    if (this.hashTable.has(memberIdNum)) {
      const userInfo = this.hashTable.get(memberIdNum);
      console.log("Found user info:", userInfo);
      return userInfo.lectureHistoryId;
    } else {
      console.log("No lecture history ID found for memberId:", memberIdNum);
      return undefined;
    }
  }
}
