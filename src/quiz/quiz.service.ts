import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizSetEntity } from '../entities/quiz-set.entity';
import { ChoiceEntity } from '../entities/choice.entity';
import { RecommendationEntity } from '../entities/recommendation-entity';
import { ReadQuizSetDTO, ReadCertainLectureQuizDTO } from './dto/quiz_sets.dto';
import { MemberEntity } from 'src/entities/member.entity';
import { SubLectureEntity } from 'src/entities/sub-lecture.entity';

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

  async retrieveQuizEntity(subLectureId: number): Promise<QuizEntity[]> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    const quizzes = await this.quizRepository.find({
      where: { quizSet: { subLecture: { id: subLectureId } } },
      relations: ['choices', 'quizResults'],
    });
    return quizzes;
  }

  async insertQuizSets(
    title: string,
    subLecture: SubLectureEntity,
    member: MemberEntity,
  ): Promise<number> {
    // 주어진 title과 name으로 MainLectureEntity를 찾음.
    const existingQuizSets = await this.quizSetRepository.findOne({
      where: {
        title,
        member: { id: member.id },
        subLecture: { id: subLecture.id },
      },
    });

    // 이미 존재하는 MainLectureEntity가 있다면 해당 엔티티의 id를 반환.
    if (existingQuizSets) {
      throw new HttpException(
        'QuizSet already exists',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    // 존재하지 않는다면 새로운 MainLectureEntity를 생성하고 저장.
    const newQuizSets = this.quizSetRepository.create({
      title,
      member,
      subLecture,
    });
    await this.quizSetRepository.save(newQuizSets);

    // 저장한 SubLectureEntity의 id를 반환.
    return newQuizSets.id;
  }

  private popupTimeChangeSecond(popupTime: string): number | null {
    if (!popupTime) {
      throw new HttpException(
        'Invalid input: popupTime is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const time = popupTime.split(':').map(Number); // 문자열을 ':'를 기준으로 분리하여 숫자 배열로 변환
    if (time.length !== 3) {
      throw new HttpException(
        'Invalid input: popupTime must be in the format "HH:MM:SS"',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const second = time[0] * 3600 + time[1] * 60 + time[2]; // 시간, 분, 초를 초로 변환
    return second;
  }

  async insertQuizzes(quizzes, quizSetsId): Promise<number> {
    const quizSets = await this.quizSetRepository.findOne({
      where: { id: quizSetsId },
    });
    if (!quizSets) {
      throw new Error('quizSets not found');
    }
    // 존재하지 않는다면 새로운 MainLectureEntity를 생성하고 저장.
    const newQuizzes = this.quizRepository.create({
      quizSet: quizSets,
      instruction: quizzes.instruction,
      commentary: quizzes.commentary,
      popupTime: this.popupTimeChangeSecond(quizzes.popupTime),
    });
    await this.quizRepository.save(newQuizzes);
    return newQuizzes.id;
  }
  async insertChoices(choices, quizzesId): Promise<number> {
    const quizzes = await this.quizRepository.findOne({
      where: { id: quizzesId },
    });
    if (!quizzes) {
      throw new Error('quizzes not found');
    }
    const newChoices = this.choiceRepository.create({
      quiz: quizzes,
      content: choices.content,
      isAnswer: choices.isAnswer,
    });
    await this.choiceRepository.save(newChoices);

    return newChoices.id;
  }

  async readQuizSet(): Promise<ReadQuizSetDTO[]> {
    const quizSets = await this.quizSetRepository.find({
      relations: ['subLecture', 'member', 'recommendations'],
      //relations: quizSetRepository와 관계된 엔티티의 정보를 함께 로드
      order: { createdAt: 'DESC' },
    });

    const allQuizSet: ReadQuizSetDTO[] = await Promise.all(
      //가져온 quiz_sets를 순회하면서 각 quiz_sets의 정보를 ReadQuizSetDTO 형식으로 매핑
      quizSets.map(async (quizSet) => {
        //quizSets을 순회하면서 각 요소인 quizSet에 접근하여 필요로하는 값들을 리턴
        const recommendationCount = await this.recommendationRepository.count({
          where: { quizSet: { id: quizSet.id } },
        });
        return {
          quizSetId: quizSet.id,
          quizSetTitle: quizSet.title,
          subLectureTitle: quizSet.subLecture.title,
          subLectureUrl: quizSet.subLecture.url,
          memberNickname: quizSet.member.nickname,
          createdAt: quizSet.createdAt,
          recommendationCount: recommendationCount,
        };
      }),
    );

    return allQuizSet;
  }

  async readQuizDetails(
    quizSetId: number,
    isSeeCommentary: boolean,
    isSeeAnswer: boolean,
  ): Promise<any[]> {
    // 문제집의 id에 해당하는 퀴즈를 찾음
    const quizzes = await this.quizRepository.find({
      where: { quizSet: { id: quizSetId } },
    });
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(
        'No quizzes found for the provided quiz set id.',
      );
    }

    const quizDetails = [];
    for (const quiz of quizzes) {
      // 퀴즈의 선택지 정보를 가져오는 경우
      let choiceDetails = [];

      const choices = await this.choiceRepository.find({
        where: { quiz: { id: quiz.id } },
      });
      choiceDetails = choices.map((choice) => ({
        choiceId: choice.id,
        content: choice.content,
        ...(isSeeAnswer && { isAnswer: choice.isAnswer }), // isSeeAnswer가 true일 때만 isAnswer를 추가
      }));

      // 퀴즈 상세 정보를 배열에 추가
      quizDetails.push({
        quizId: quiz.id,
        instruction: quiz.instruction,
        ...(isSeeCommentary && { commentary: quiz.commentary }), // isSeeCommentary true일 때만 commentary를 추가
        popupTime: quiz.popupTime,
        choice: choiceDetails,
      });
    }

    return quizDetails;
  }

  async readCertainQuizSets(subLectureUrl: string) {
    const quizSets = await this.quizSetRepository.find({
      where: {
        subLecture: { url: subLectureUrl },
      },
      relations: ['member', 'recommendations'],
      //relations: quizSetRepository와 관계된 엔티티의 정보를 함께 로드
    });
    const allQuizSet: ReadCertainLectureQuizDTO[] = await Promise.all(
      quizSets.map(async (quizSet) => {
        const recommendationCount = await this.recommendationRepository.count({
          where: { quizSet: { id: quizSet.id } },
        });
        return {
          quizSetId: quizSet.id,
          quizSetTitle: quizSet.title,
          quizSetAuthor: quizSet.member.nickname,
          recommendationCount,
          createdAt: quizSet.createdAt,
        };
      }),
    );

    return allQuizSet;
  }
}
