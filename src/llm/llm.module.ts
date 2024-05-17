import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptCommentEntity } from '../entities/gpt-comment.entity';
import LLMService from './llm.service';
import { LectureHistoryEntity } from 'src/entities/lecture-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GptCommentEntity, LectureHistoryEntity])],
  exports: [LLMService],
  providers: [LLMService],
})
export class LLMModule {}
