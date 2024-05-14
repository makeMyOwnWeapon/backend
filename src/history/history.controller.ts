import { Controller, Get, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import {
  ReadHistoryReportDTO,
  ReadHistoryReportExtentionDTO,
} from './dto/readHistoryReport.dto';
import { UserRequest } from '../auth/UserRequest';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import LLMService from 'src/llm/llm.service';

@ApiTags('histories')
@Controller('history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private quizService: QuizService,
    private llmService: LLMService,
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
      const quizzes = [];
      const reports = [];
      for (let i = 0; i < quizResult.length; i++) {
        quizzes[i] =
          await this.quizService.retrieveQuizEntityByQuizResultEntity(
            quizResult[i],
          );

        reports[i] = await this.historyService.readHistoryReport(
          lectureHistoryId,
          memberId,
          quizzes[i],
        );
      }
      return reports;
    } else {
      const histories = await this.historyService.readHistories(memberId);
      return histories.reverse();
    }
  }
  @Public()
  @Get('/extension')
  @ApiOperation({
    summary: '회원레포트 익스텐션에서 상세 조회',
  })
  async readHistoriesInExtension(
    @Query('lectureHistoryId') lectureHistoryId: number,
  ): Promise<ReadHistoryReportExtentionDTO> {
    const quizResult =
      await this.historyService.retrieveQuizResultEntity(lectureHistoryId);

    const quizzes = [];
    const reports = [];
    const quizResultString = [];
    const gptSummery = [];
    for (let i = 0; i < quizResult.length; i++) {
      quizzes[i] = await this.quizService.retrieveQuizEntityByQuizResultEntity(
        quizResult[i],
      );

      reports[i] = await this.historyService.readHistoryReportExtension(
        lectureHistoryId,
        quizzes[i],
      );

      quizResultString[i] = await this.llmService.convertQuizResultToString(
        quizzes[i],
      );

      gptSummery[i] = await this.llmService.generateSummary(
        quizResultString[i],
      );
    }

    return { reports, gptSummery };
  }
}
