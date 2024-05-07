import { Body, Controller, Post, Get, Param, Query, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizSetDTO } from './dto/quiz.dto';
import { RecommendationDTO } from './dto/quiz_sets.dto';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberService } from 'src/member/member.service';
import { JwtService } from '@nestjs/jwt';
import { UserRequest } from '../auth/UserRequest';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('quizsets')
@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private memberService: MemberService,
    private jwtService: JwtService,
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
}
