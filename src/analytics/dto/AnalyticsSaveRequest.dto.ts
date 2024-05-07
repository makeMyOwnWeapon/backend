import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { LectureHistoryEntity } from 'src/entities/lecture-history.entity';
import { VideoAnalyticsHistoryEntity } from '../../entities/video-analytics-history.entity';

export class AnalyticsSaveRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly startedAt: string;

  @IsNotEmpty()
  @IsString()
  readonly endedAt: string;

  @IsNotEmpty()
  @IsNumber()
  readonly analysisType: number;
  toEntity(lectureHistory: LectureHistoryEntity): VideoAnalyticsHistoryEntity {
    const entity = new VideoAnalyticsHistoryEntity();
    entity.startedAt = new Date(this.parseDateString(this.startedAt));
    entity.endedAt = new Date(this.parseDateString(this.endedAt));
    entity.analysisType = Number(this.analysisType);
    entity.lectureHistories = lectureHistory;
    return entity;
  }

  parseDateString(dateString) {
    const datePart = dateString.substring(0, 8);
    const timePart = dateString.substring(9);

    const year = parseInt(datePart.substring(0, 4), 10);
    const month = parseInt(datePart.substring(4, 6), 10) - 1; // JS에서는 월이 0부터 시작합니다.
    const day = parseInt(datePart.substring(6, 8), 10);

    const hours = parseInt(timePart.substring(0, 2), 10);
    const minutes = parseInt(timePart.substring(3, 5), 10);
    const seconds = parseInt(timePart.substring(6, 8), 10);

    return new Date(year, month, day, hours, minutes, seconds);
  }
}
