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
import { JwtService } from '@nestjs/jwt';
import { ReadSertainLectureQuizDTO } from './dto/quiz_sets.dto';

@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private jwtService: JwtService,
  ) {}

  private extractSubFromToken(authHeader: string): string | null {
    const token = authHeader?.split(' ')[1]; // Bearer 토큰 추출
    if (!token) {
      return null;
    }
    try {
      const sub = this.jwtService.decode(token).sub;
      return sub;
    } catch (error) {
      return null;
    }
  }
  /*요청: 
GET  /api/quizsets?subLectureUrl={subLectureUrl}&mainLectureTitle={mainLectureTitle}
&subLectureTitle={subLectureTitle}
Query
subLectureUrl(강의 url), subLectureTitle(소강의명), 
mainLectureTitle(대강의명)

반환:
[문제집명, 문제집 작성자, 
추천수, 작성일자]
*/
  @Get('')
  async searchQuizSets(
    @Query('subLectureUrl') subLectureUrl: string,
    @Query('mainLectureTitle') mainLectureTitle: string,
    @Query('subLectureTitle') subLectureTitle: string,
  ): Promise<ReadSertainLectureQuizDTO[]> {
    return this.quizService.searchQuizSets(
      subLectureUrl,
      mainLectureTitle,
      subLectureTitle,
    );
  }
  /*
@Get('')
들어오는 데이터: 멤버id
리턴해야할 데이터:
[
  문제집명(quiz_sets title), 
  소강의명(sub_lectures title),
  등록자 닉네임(members nickname),
  작성일자(quiz_sets created_at),
  추천수(recommendations quiz_set_id 갯수)
]
*/
  @Get('')
  async readQuiz() {
    const quizSetDetails = await this.quizService.readQuizSet();
    return quizSetDetails;
  }

  /*
  요청:
GET   /api/quizsets/{quizsetsId}/quizzes?choices={}&commentary={}   
Path & Query
quizsetsId : 문제집의 id, commentary(해설 제공여부),
choices(선택지 제공여부)
(제공 여부는 true or false이다.)

응답: 
[
  문제, 
  해설,
  팝업 시각, 
  [
    선택지id,
    내용,
    정답 여부
  ]
]
*/
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

  /* 
@Post('')
body에 들어오는 데이터:

mainLectureTitle(대강의명), main_lectures 
lecturerName(강사명), main_lectures
subLectureUrl(강의 url), sub_lectures 1
subLectureTitle(소강의명), sub_lectures
duration(강의시간, 초단위 정수), sub_lectures
title(문제집명), quiz_sets 1
[
    instruction(문제), quizzes 2
    commentary(해설), quizzes 2
    popupTime(팝업시각, 'hh:mm:ss'), quizzes 1
    [
        content(선택지), choices 2
        isAnswer(정답여부) choices 2
    ]
]
*/
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
      quizInfo.subLectureUrl,
      quizInfo.subLectureTitle,
      quizInfo.duration,
      mainLectureId,
    );
    const memberId = this.extractSubFromToken(authHeader);
    const quizSetsId = await this.quizService.insertQuizSets(
      quizInfo.title,
      subLectureId,
      memberId,
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
