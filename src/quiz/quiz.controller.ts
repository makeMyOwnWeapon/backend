import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizSetDTO } from './dto/quiz.dto';
import { RecommendationDTO } from './dto/quiz_sets.dto';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberService } from 'src/member/member.service';
import { UserRequest } from '../auth/UserRequest';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthorizationCode } from 'src/entities/member.entity';
import { AIQuizCreateRequestDTO } from './dto/ai-quiz-create-request.dto';
import LLMService from 'src/llm/llm.service';
import { QuizDTO } from 'src/quiz/dto/quiz.dto';

@ApiTags('quizsets')
@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private memberService: MemberService,
    private llmService: LLMService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '특정강의의 문제집 조회',
    description: '특정강의의 문제집 조회',
  })
  async readQuiz(@Query('subLectureUrl') subLectureUrlEncoded: string) {
    if (subLectureUrlEncoded) {
      const subLectureUrl = decodeURIComponent(subLectureUrlEncoded);
      return await this.quizService.readCertainQuizSets(subLectureUrl);
    } else {
      return await this.quizService.readQuizSet();
    }
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
    @Req() req: UserRequest,
    @Body() dto: AIQuizCreateRequestDTO,
  ): Promise<QuizDTO> {
    const IS_AI_QUIZ_MAKER = req.user.authorizationCode;
    const AI_ID = req.user.id;
    if (IS_AI_QUIZ_MAKER !== AuthorizationCode.AI_QUIZ_MAKER) {
      throw new ForbiddenException('권한이 없습니다');
    }
    const AI_QUIZ_MAKER = await this.memberService.retrieveMemberEntity(AI_ID);
    const quiz = await this.llmService.generateQuiz(dto.script);
    quiz.popupTime = dto.popuptime;
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
