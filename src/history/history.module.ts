import { Module, forwardRef } from '@nestjs/common';
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
import { LLMModule } from 'src/llm/llm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureHistoryEntity,
      VideoAnalyticsHistoryEntity,
      GptUsageHistoryEntity,
      QuizResultEntity,
    ]),
    forwardRef(() => QuizModule),
    MemberModule,
    LectureModule,
    LLMModule,
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
