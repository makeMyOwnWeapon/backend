import { IsDateString, IsString } from 'class-validator';

export class LectureHistoryInitRequestDto {
  @IsString()
  subLectureUrl: string;
  @IsDateString()
  startedAt: Date;
}
