import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { SubLectureEntity } from '../entities/sub-lecture.entity';
import { LectureImageUrlEntity } from '../entities/lecture-image-url.entity';
import { LectureController } from './lecture.controller';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MainLectureEntity,
      SubLectureEntity,
      LectureImageUrlEntity,
      LectureHistoryEntity,
    ]),
  ],
  providers: [LectureService],
  exports: [LectureService],
  controllers: [LectureController],
})
export class LectureModule {}
