import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizSetDTO } from './dto/quiz.dto';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberService } from 'src/member/member.service';
import { JwtService } from '@nestjs/jwt';

@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private memberService: MemberService,
    private jwtService: JwtService,
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
  async readQuiz(@Query('subLectureUrl') subLectureUrlEncoded: string) {
    if (subLectureUrlEncoded) {
      const subLectureUrl = decodeURIComponent(subLectureUrlEncoded);
      return await this.quizService.readCertainQuizSets(subLectureUrl);
    } else {
      return await this.quizService.readQuizSet();
    }
  }

  @Get('/:quizsetId/quizzes')
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

  @Post('')
  async createQuiz(
    @Body() quizInfo: CreateQuizSetDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const mainLectureId = await this.lectureService.insertMainLectures(
      quizInfo.mainLectureTitle,
      quizInfo.lecturerName,
    );
    const subLectureId = await this.lectureService.insertSubLectures(
      decodeURIComponent(quizInfo.subLectureUrl),
      quizInfo.subLectureTitle,
      quizInfo.duration,
      mainLectureId,
    );
    const memberId = this.extractIdFromToken(authHeader);
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
