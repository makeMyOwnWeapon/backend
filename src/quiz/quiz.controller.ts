import { Body, Controller, Post, Headers } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizSetDTO } from './dto/quiz.dto';
import { LectureService } from 'src/lecture/lecture.service';
import { JwtService } from '@nestjs/jwt';

@Controller('quizsets')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private lectureService: LectureService,
    private jwtService: JwtService,
  ) {}

  private extractSubFromToken(authHeader: string): string | null {
    const token = authHeader?.split(' ')[1].split('"')[1]; // Bearer 토큰 추출
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
/* 
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

todo: 
1. quizset에 대한 dto생성
2. 서비스에 넘겨주기
3. 서비스에서 여러 레퍼지토리를 가지고 저장하기
3.1 문제집 저장
3.2 문제 저장
3.3 선택지 저장
*/
