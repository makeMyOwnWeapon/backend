import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { GptUsageHistoryEntity } from '../entities/gpt-usage-history';
import { QuizResultEntity } from '../entities/quiz-result.entity';
import { HistoryController } from './history.controller';
import { LectureModule } from '../lecture/lecture.module';
import { MemberModule } from 'src/member/member.module';
import { QuizModule } from 'src/quiz/quiz.module';
// import { QuizEntity } from 'src/entities/quiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureHistoryEntity,
      VideoAnalyticsHistoryEntity,
      GptUsageHistoryEntity,
      QuizResultEntity,
    ]),
    QuizModule,
    MemberModule,
    LectureModule,
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
