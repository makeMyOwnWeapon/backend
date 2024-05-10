import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Req,
  Delete,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizSetDTO, NoTimeConvertingQuizDTO } from './dto/quiz.dto';
import { RecommendationDTO } from './dto/quiz_sets.dto';
import { CreateQuizResultDTO } from './dto/quiz_result.dto';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberService } from 'src/member/member.service';
import { HistoryService } from 'src/history/history.service';
import { UserRequest } from '../auth/UserRequest';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIQuizCreateRequestDTO } from './dto/ai-quiz-create.dto';
import LLMService from 'src/llm/llm.service';

@ApiTags('quizsets')
@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private memberService: MemberService,
    private historyService: HistoryService,
    private llmService: LLMService,
  ) {}

  @Post('/quizResults')
  @ApiOperation({
    summary: '사용자 문제풀이 결과 저장',
  })
  async createQuizResult(@Body() quizResult: CreateQuizResultDTO) {
    const quiz = await this.quizService.retrieveQuizEntityByChoiceId(
      quizResult.choiceId,
    );
    const choice = await this.quizService.retrieveChoiceEntityByChoiceId(
      quizResult.choiceId,
    );
    const lectureHistory =
      await this.historyService.retrieveLectureHistoryEntity(
        quizResult.lectureHistoriesId,
      );
    return await this.quizService.createQuizResult(
      quizResult.isCorrect,
      quizResult.solvedDuration,
      quiz,
      choice,
      lectureHistory,
    );
  }

  @Get('/')
  @ApiOperation({
    summary: '특정강의의 문제집 조회',
  })
  async readQuiz(@Query('subLectureUrl') subLectureUrlEncoded: string) {
    if (subLectureUrlEncoded) {
      const subLectureUrl = decodeURIComponent(subLectureUrlEncoded);
      return await this.quizService.readCertainQuizSets(subLectureUrl);
    } else {
      return await this.quizService.readQuizSet();
    }
  }

  @Get('/:quizSetId/can-delete')
  @ApiOperation({
    summary: '특정 회원의 문제집 접근 권한 검사',
  })
  async checkQuizSetAccess(
    @Req() req: UserRequest,
    @Param('quizSetId') quizSetId: number,
  ): Promise<{ access: boolean }> {
    const hasAccess = await this.quizService.checkAccess(
      req.user.id,
      quizSetId,
    );
    return { access: hasAccess };
  }

  @Get('/:quizsetId/quizzes')
  @ApiOperation({
    summary: '문제집의 문제조회',
    description: '문제집의 문제조회',
  })
  async getQuizDetails(
    @Param('quizsetId') quizsetId: number,
    @Query('commentary') isSeeCommentary: boolean,
    @Query('answer') isSeeAnswer: boolean,
  ) {
    return this.quizService.readQuizDetails(
      quizsetId,
      isSeeCommentary,
      isSeeAnswer,
    );
  }
  @Delete('/:quizsetId/quizzes')
  @ApiOperation({
    summary: '문제집의 문제삭제',
  })
  async quizDelete(@Param('quizsetId') quizsetId: number) {
    return this.quizService.deleteQuizSet(quizsetId);
  }

  @Post('/recommendation')
  @ApiOperation({
    summary: '추천수 반영',
    description: '추천수 반영',
  })
  async updateRecommandation(
    @Req() req: UserRequest,
    @Body() recommendationInfo: RecommendationDTO,
  ) {
    const memberId = req.user.id;
    const NumOfRecommendations = recommendationInfo.numOfRecommendation;
    const quizSetId = recommendationInfo.quizSetId;

    return (
      NumOfRecommendations +
      (await this.quizService.updateRecommandation(memberId, quizSetId))
    );
  }

  @Post('')
  @ApiOperation({
    summary: '문제집 등록',
    description: '문제집 등록',
  })
  async createQuiz(
    @Req() req: UserRequest,
    @Body() quizInfo: CreateQuizSetDTO,
  ) {
    const mainLectureId = await this.lectureService.insertMainLectures(
      quizInfo.mainLectureTitle,
    );
    const subLectureId = await this.lectureService.insertSubLectures(
      decodeURIComponent(quizInfo.subLectureUrl),
      quizInfo.subLectureTitle,
      quizInfo.duration,
      mainLectureId,
    );
    const memberId = req.user.id;
    const subLecture =
      await this.lectureService.retrieveSubLectureEntity(subLectureId);
    const member = await this.memberService.retrieveMemberEntity(memberId);
    const quizSetsId = await this.quizService.insertQuizSets(
      quizInfo.title,
      subLecture,
      member,
    );
    for (let i = 0; i < quizInfo.quizzes.length; i++) {
      const quizzesId = await this.quizService.insertQuizzes(
        quizInfo.quizzes[i],
        quizSetsId,
      );

      for (let j = 0; j < quizInfo.quizzes[i].choices.length; j++) {
        await this.quizService.insertChoices(
          quizInfo.quizzes[i].choices[j],
          quizzesId,
        );
      }
    }

    return quizSetsId;
  }

  @Post('/llm')
  @ApiOperation({
    summary: 'AI를 이용한 문제집 등록',
    description:
      'Claude를 통해 강의 스크립트를 입력받아 특정 강의의 문제집을 만들어냄',
  })
  async createQuizWithAI(
    @Body() dto: AIQuizCreateRequestDTO,
  ): Promise<NoTimeConvertingQuizDTO> {
    const AI_ID = 0;
    const AI_QUIZ_MAKER = await this.memberService.retrieveMemberEntity(AI_ID);
    const quiz = await this.llmService.generateQuiz(dto.script);
    quiz.popupTime = dto.popupTime;
    const subLecture = await this.lectureService.retrieveSubLectureEntity(
      dto.subLectureId,
    );
    const quizDto = await this.quizService.upsertQuizSetWithQuiz(
      'AI가 만든 문제집',
      subLecture,
      AI_QUIZ_MAKER,
      quiz,
    );
    return quizDto;
  }
}
