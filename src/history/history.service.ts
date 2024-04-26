import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { GptUsageHistoryEntity } from '../entities/gpt-usage-history';
import { QuizResultEntity } from '../entities/quiz-result.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(LectureHistoryEntity)
    private readonly lectureHistoryRepository: Repository<LectureHistoryEntity>,
    @InjectRepository(VideoAnalyticsHistoryEntity)
    private readonly videoAnalyticsHistoryRepository: Repository<VideoAnalyticsHistoryEntity>,
    @InjectRepository(GptUsageHistoryEntity)
    private readonly gptUsageHistoryEntity: Repository<GptUsageHistoryEntity>,
    @InjectRepository(QuizResultEntity)
    private readonly quizResultEntity: Repository<QuizResultEntity>,
  ) {}
}
