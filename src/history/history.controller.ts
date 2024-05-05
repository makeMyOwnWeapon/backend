import { Controller, Get, Headers, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import { ReadHistoryReportDTO } from './dto/readHistoryReport.dto';

@Controller('history')
export class HistoryController {
  constructor(
    private jwtService: JwtService,
    private historyService: HistoryService,
    private quizService: QuizService,
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
  async readHistories(
    @Headers('Authorization') authHeader: string,
    @Query('subLectureId') subLectureId: number,
  ): Promise<ReadHistoryReportDTO | ReadHistoriesDTO[]> {
    const memberId = this.extractIdFromToken(authHeader);
    if (subLectureId) {
      const quizzes = await this.quizService.retrieveQuizEntity(subLectureId);
      return await this.historyService.readHistoryReport(
        subLectureId,
        memberId,
        quizzes,
      );
    } else {
      return await this.historyService.readHistories(memberId);
    }
  }
}
