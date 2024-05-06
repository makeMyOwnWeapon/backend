import { Controller, Get, Query, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import { ReadHistoryReportDTO } from './dto/readHistoryReport.dto';
import { UserRequest } from '../auth/UserRequest';

@Controller('history')
export class HistoryController {
  constructor(
    private jwtService: JwtService,
    private historyService: HistoryService,
    private quizService: QuizService,
  ) {}
  @Get('/')
  async readHistories(
    @Req() req: UserRequest,
    @Query('subLectureId') subLectureId: number,
  ): Promise<ReadHistoryReportDTO | ReadHistoriesDTO[]> {
    const memberId = req.user.id;
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
