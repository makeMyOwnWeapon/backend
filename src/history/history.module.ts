import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { GptUsageHistoryEntity } from '../entities/gpt-usage-history';
import { QuizResultEntity } from '../entities/quiz-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureHistoryEntity,
      VideoAnalyticsHistoryEntity,
      GptUsageHistoryEntity,
      QuizResultEntity,
    ]),
  ],
  providers: [HistoryService],
})
export class HistoryModule {}
