import { Injectable } from '@nestjs/common';
import { QuizEntity } from '../entities/quiz.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizSetEntity } from '../entities/quiz-set.entity';
import { ChoiceEntity } from '../entities/choice.entity';
import { RecommendationEntity } from '../entities/recommendation-entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(QuizSetEntity)
    private readonly quizSetRepository: Repository<QuizSetEntity>,
    @InjectRepository(ChoiceEntity)
    private readonly choiceRepository: Repository<ChoiceEntity>,
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepository: Repository<RecommendationEntity>,
  ) {}
  createLecture(quiz) {
    return '';
  }
}
