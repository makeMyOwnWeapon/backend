import { Controller, Get, Query, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import { ReadHistoryReportDTO } from './dto/readHistoryReport.dto';
import { UserRequest } from '../auth/UserRequest';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';

@ApiTags('histories')
@Controller('history')
export class HistoryController {
  constructor(
    private jwtService: JwtService,
    private historyService: HistoryService,
    private quizService: QuizService,
  ) {}
  @Get('/')
  @ApiOperation({
    summary: '회원레포트 목록/상세 조회',
    description: '회원레포트 목록/상세 조회',
  })
  async readHistories(
    @Req() req: UserRequest,
    @Query('lectureHistoryId') lectureHistoryId: number,
  ): Promise<ReadHistoryReportDTO | ReadHistoriesDTO[]> {
    const memberId = req.user.id;
    if (lectureHistoryId) {
      const quizResult =
        await this.historyService.retrieveQuizResultEntity(lectureHistoryId);
      const quizzes =
        await this.quizService.retrieveQuizEntityByQuizResultEntity(quizResult);
      return await this.historyService.readHistoryReport(
        lectureHistoryId,
        memberId,
        quizzes,
      );
    } else {
      return await this.historyService.readHistories(memberId);
    }
  }
  @Public()
  @Get('/extension')
  @ApiOperation({
    summary: '회원레포트 익스텐션에서 상세 조회',
  })
  async readHistoriesInExtension(
    @Query('lectureHistoryId') lectureHistoryId: number,
  ): Promise<ReadHistoryReportDTO> {
    const quizResult =
      await this.historyService.retrieveQuizResultEntity(lectureHistoryId);
    const quizzes =
      await this.quizService.retrieveQuizEntityByQuizResultEntity(quizResult);
    return await this.historyService.readHistoryReportExtension(
      lectureHistoryId,
      quizzes,
    );
  }
}
