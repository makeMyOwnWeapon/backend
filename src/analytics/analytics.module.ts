import { Module, forwardRef } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from "../member/member.module";
import { LectureModule } from "../lecture/lecture.module";
import { VideoAnalyticsHistoryEntity } from "../entities/video-analytics-history.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoAnalyticsHistoryEntity,
    ]),
    AuthModule, 
    MemberModule, 
    LectureModule,
    forwardRef(() => AppModule)
    ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
