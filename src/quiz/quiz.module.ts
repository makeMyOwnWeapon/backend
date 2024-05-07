import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizSetEntity } from '../entities/quiz-set.entity';
import { ChoiceEntity } from '../entities/choice.entity';
import { RecommendationEntity } from '../entities/recommendation-entity';
import { QuizController } from './quiz.controller';
import { LectureModule } from '../lecture/lecture.module';
import { MemberModule } from 'src/member/member.module';
import { MemberEntity } from 'src/entities/member.entity';
import { LLMModule } from 'src/llm/llm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      QuizEntity,
      QuizSetEntity,
      ChoiceEntity,
      RecommendationEntity,
    ]),
    LectureModule,
    MemberModule,
    LLMModule,
  ],
  providers: [QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
