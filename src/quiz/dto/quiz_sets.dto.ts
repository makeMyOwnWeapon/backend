import { IsString, IsInt } from 'class-validator';

export class ReadQuizSetDTO {
  @IsInt()
  quizSetId: number;
  @IsString()
  quizSetTitle: string;
  @IsString()
  subLectureTitle: string;
  @IsString()
  subLectureUrl: string;
  @IsString()
  memberNickname: string;
  @IsString()
  createdAt: Date;
  @IsInt()
  recommendationCount: number;
}
