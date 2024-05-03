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
  async readHistories(memberId: number) {
    try {
      // 사용자의 레포트 목록을 조회합니다.
      const histories = await this.lectureHistoryRepository.find({
        where: { member: { id: memberId } }, // 사용자 ID에 해당하는 레포트만 가져옵니다.
        relations: ['subLecture', 'subLecture.mainLecture'], // 관련된 엔티티들을 함께 로드합니다.
      });

      // 레포트 목록을 반환합니다.
      return histories.map((history) => ({
        subLectureId: history.subLecture.id,
        subLectureTitle: history.subLecture.title,
        lecturerName: history.subLecture.mainLecture.lecturer_name,
        registrationDate: history.createdAt,
      }));
    } catch (error) {
      // 에러가 발생한 경우 예외를 던집니다.
      throw new Error('Failed to retrieve history');
    }
  }
}
