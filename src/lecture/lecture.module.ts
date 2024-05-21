import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { SubLectureEntity } from '../entities/sub-lecture.entity';
import { LectureController } from './lecture.controller';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { GptCommentEntity } from '../entities/gpt-comment.entity';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MainLectureEntity,
      SubLectureEntity,
      LectureHistoryEntity,
      GptCommentEntity,
    ]),
    MemberModule,
  ],
  providers: [LectureService],
  exports: [LectureService],
  controllers: [LectureController],
})
export class LectureModule {}
