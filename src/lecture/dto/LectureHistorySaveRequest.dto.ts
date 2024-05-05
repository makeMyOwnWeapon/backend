import { IsDateString } from 'class-validator';

export class LectureHistorySaveRequestDto {
  @IsDateString()
  endedAt: Date;
}
