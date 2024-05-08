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
        lectureHistoryId: payload.lectureHistoryId,
      };
      this.hashTable.set(memberIdNum, updatedInfo);
      console.log('Hash Table Updated with Lecture History:', this.hashTable);
  
      const socketId = this.hashTable.get(memberIdNum).socketId;
      if (socketId) {
        this.server.to(socketId).emit('historyget', { lectureHistoryId: payload.lectureHistoryId });
        //console.log('Sending lecture history ID to client:', socketId, payload.lectureHistoryId);
      }
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

  @SubscribeMessage('disconnectRequest')
  handleDisconnectRequest(client: Socket, data: any) {
    const memberId = Number(this.jwtService.decode(data.token)?.id);
    const userInfo = this.hashTable.get(memberId);
    if (userInfo && userInfo.lectureHistoryId) {
      this.eventEmitter.emit('member.disconnect', { endedTime: data.time, lectureHistoryId: userInfo.lectureHistoryId });
    } else {
      console.log(`No Lecture History ID found for Member ID ${memberId}`);
    }
  }

  wakeup(memberId: number) {
    const memberIdNum = Number(memberId);
    if (!this.hashTable.has(memberIdNum)) {
      throw new Error('소켓 연결이 없습니다.');
    }
    const connectionInfo = this.hashTable.get(memberIdNum);
    this.server.to(connectionInfo.socketId).emit('wakeup', 'hello');
  }
  
  isConnected(memberId: number): boolean {
    const connectionInfo = this.hashTable.get(memberId);
    return !!connectionInfo && !!this.server.sockets.adapter.rooms.get(connectionInfo.socketId);
  }
  

  getLectureHistoryId(memberId: number): number | undefined {
    const memberIdNum = Number(memberId);
    console.log('Fetching lecture history ID for memberId:', memberIdNum);
    console.log('Current hash table state:', this.hashTable);

    if (this.hashTable.has(memberIdNum)) {
      const userInfo = this.hashTable.get(memberIdNum);
      console.log('Found user info:', userInfo);
      return userInfo.lectureHistoryId;
    } else {
      console.log('No lecture history ID found for memberId:', memberIdNum);
      return undefined;
    }
  }
}
