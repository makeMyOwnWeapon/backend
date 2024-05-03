import { Controller, Get, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(
    private jwtService: JwtService,
    private historyService: HistoryService,
  ) {}

  private extractIdFromToken(authHeader: string): number | null {
    const token = authHeader?.split(' ')[1]; // Bearer 토큰 추출
    if (!token) {
      return null;
    }
    try {
      const memberId = this.jwtService.decode(token).id;
      return memberId;
    } catch (error) {
      return null;
    }
  }

  @Get('/')
  async readHistories(@Headers('Authorization') authHeader: string) {
    const memberId = this.extractIdFromToken(authHeader);
    return this.historyService.readHistories(memberId);
  }
}
