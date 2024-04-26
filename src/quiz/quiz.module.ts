import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizSetEntity } from '../entities/quiz-set.entity';
import { ChoiceEntity } from '../entities/choice.entity';
import { RecommendationEntity } from '../entities/recommendation-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      QuizSetEntity,
      ChoiceEntity,
      RecommendationEntity,
    ]),
  ],
  providers: [QuizService],
})
export class QuizModule {}
