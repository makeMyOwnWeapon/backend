import { IsInt } from 'class-validator';

export class LectureHistoryResponseDto {
  @IsInt()
  lectureHistoryId: number;
}
