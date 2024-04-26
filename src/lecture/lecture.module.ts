import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { SubLectureEntity } from '../entities/sub-lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainLectureEntity, SubLectureEntity])],
  providers: [LectureService],
})
export class LectureModule {}
