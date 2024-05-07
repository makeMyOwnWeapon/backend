import { Module, forwardRef } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { LectureModule } from '../lecture/lecture.module';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { GptUsageHistoryEntity } from '../entities/gpt-usage-history';
import { QuizResultEntity } from '../entities/quiz-result.entity';
import { HistoryModule } from 'src/history/history.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAnalyticsHistoryEntity]),
    AuthModule,
    MemberModule,
    LectureModule,
    HistoryModule,
    forwardRef(() => AppModule),
  ],

  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
