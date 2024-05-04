import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { GptUsageHistoryEntity } from '../entities/gpt-usage-history';
import { QuizResultEntity } from '../entities/quiz-result.entity';
import { QuizEntity } from 'src/entities/quiz.entity';
import { ReadHistoriesDTO } from './dto/readHistories.dto';
import { ReadHistoryReportDTO } from './dto/readHistoryReport.dto';

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
  async readHistories(memberId: number): Promise<ReadHistoriesDTO[]> {
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
      throw new BadRequestException('Bad Request');
    }
  }

  async readHistoryReport(
    subLectureId: number,
    memberId: number,
    quizzes: QuizEntity[],
  ): Promise<ReadHistoryReportDTO> {
    try {
      // 강의 시작 및 종료 시간 가져오기
      const lectureHistory = await this.lectureHistoryRepository.findOne({
        where: { subLecture: { id: subLectureId }, member: { id: memberId } },
      });

      // 졸음 및 자리이탈 이력 가져오기
      const videoAnalyticsHistories =
        await this.videoAnalyticsHistoryRepository.find({
          where: { lectureHistories: { id: lectureHistory.id } },
        });

      // 퀴즈 결과 가져오기
      const quizResults = await this.quizResultEntity.find({
        where: { lectureHistories: { id: lectureHistory.id } },
        relations: ['quiz', 'choice'],
      });

      // 졸음 및 자리이탈 이력, 퀴즈 결과, 선택지 등을 조합하여 반환
      return {
        studyStartTime: lectureHistory.startedAt,
        studyEndTime: lectureHistory.endedAt,
        sleepinessAndDistraction: videoAnalyticsHistories.map((history) => ({
          sleepinessStart:
            history.analysisType === 1 ? history.startedAt : null,
          sleepinessEnd: history.analysisType === 1 ? history.endedAt : null,
          distractionStart:
            history.analysisType === 0 ? history.startedAt : null,
          distractionEnd: history.analysisType === 0 ? history.endedAt : null,
        })),
        quizzes: quizzes.map((quiz) => {
          const result = quizResults.find(
            (result) => result.quiz.id === quiz.id,
          );
          const choice = result ? result.choice : null;
          return {
            question: quiz.instruction,
            commentary: quiz.commentary,
            choices: quiz.choices.map((choice) => ({
              content: choice.content,
              isAnswer: choice.isAnswer,
            })),
            userChoice: choice ? choice.content : null,
            isCorrect: result ? result.isCorrect : null,
            solvedDuration: result ? result.solvedDuration : null,
          };
        }),
      };
    } catch (error) {
      // 에러 처리
      console.error('Failed to retrieve history report:', error);
      throw new NotFoundException('Not Found');
    }
  }
}
