import { Controller, Get, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import {
  ReadHistoryReportForExtentionGptErrorDTO,
  ReadHistoryReportForExtentionDTO,
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
  ): Promise<
      ReadHistoryReportForExtentionGptErrorDTO
    | ReadHistoryReportForExtentionDTO
    | ReadHistoriesDTO[]
  > {
    const memberId = req.user.id;
    if (lectureHistoryId) {
      const quizResult =
        await this.historyService.retrieveQuizResultEntity(lectureHistoryId);
      const quizzes = [];

      for (let i = 0; i < quizResult.length; i++) {
        quizzes[i] =
          await this.quizService.retrieveQuizEntityByQuizResultEntity(
            quizResult[i],
          );
      }
      const reports = await this.historyService.readHistoryReport(
        lectureHistoryId,
        memberId,
        quizzes,
      );

      if (quizzes.length == 0) {
        return { reports };
      }

      const gptSummary =
        await this.llmService.readGptComments(lectureHistoryId);

      return { reports, gptSummary };
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
  ): Promise<
    ReadHistoryReportForExtentionGptErrorDTO | ReadHistoryReportForExtentionDTO
  > {
    const quizResult =
      await this.historyService.retrieveQuizResultEntity(lectureHistoryId);

    const quizzes = [];
    for (let i = 0; i < quizResult.length; i++) {
      quizzes[i] = await this.quizService.retrieveQuizEntityByQuizResultEntity(
        quizResult[i],
      );
    }

    const reports = await this.historyService.readHistoryReportExtension(
      lectureHistoryId,
      quizzes,
    );
    if (quizzes.length == 0) {
      return { reports };
    }
    const quizResultString =
      await this.llmService.convertQuizResultToString(quizzes);

    const gptSummary = await this.llmService.generateSummary(quizResultString);

    await this.llmService.saveGptComments(lectureHistoryId, gptSummary);

    return { reports, gptSummary };
  }
}
