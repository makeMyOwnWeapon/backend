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
import { QuizResultEntity } from '../entities/quiz-result.entity';
import { LectureHistoryEntity } from 'src/entities/lecture-history.entity';
import { NoTimeConvertingQuizDTO } from './dto/quiz.dto';

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
    @InjectRepository(QuizResultEntity)
    private readonly quizResultRepository: Repository<QuizResultEntity>,
  ) {}

  async createQuizResult(
    isCorrect,
    solvedDuration,
    quiz: QuizEntity,
    choice: ChoiceEntity,
    lectureHistory: LectureHistoryEntity,
  ) {
    try {
      // QuizResultEntity 생성
      const newQuizResult = new QuizResultEntity();
      newQuizResult.isCorrect = isCorrect;
      newQuizResult.solvedDuration = solvedDuration;
      newQuizResult.quiz = quiz;
      newQuizResult.choice = choice;
      newQuizResult.lectureHistories = lectureHistory;

      // 데이터베이스에 저장
      const savedQuizResult =
        await this.quizResultRepository.save(newQuizResult);

      // 저장된 QuizResultEntity의 id 반환
      return savedQuizResult.id;
    } catch (error) {
      throw new NotFoundException('Failed to create quiz result');
    }
  }

  async retrieveChoiceEntityByChoiceId(
    choiceId: number,
  ): Promise<ChoiceEntity> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    const choice = await this.choiceRepository.findOne({
      where: { id: choiceId },
    });
    return choice;
  }

  async retrieveQuizEntityByQuizResultEntity(
    quizResult: QuizResultEntity,
  ): Promise<QuizEntity[]> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    const quiz = quizResult.quiz; // 퀴즈 결과에 대한 퀴즈 엔티티 가져오기
    // if (!quiz) {
    //   throw new NotFoundException('quiz not found');
    // }
    const choices = await this.choiceRepository.find({
      where: { quiz: { id: quiz.id } },
    }); // 퀴즈에 관련된 선택지 찾기
    if (choices.length == 0) {
      console.log('choices not found');
      //throw new NotFoundException('choices not found');
    }
    console.log('choice: ', choices);
    quiz.choices = choices; // 퀴즈에 선택지 할당
    return [quiz]; // 퀴즈 엔티티 배열로 반환
  }

  async retrieveQuizEntity(subLectureId: number): Promise<QuizEntity[]> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    const quizzes = await this.quizRepository.find({
      where: { quizSet: { subLecture: { id: subLectureId } } },
      relations: ['choices', 'quizResults'],
    });
    return quizzes;
  }

  async retrieveQuizEntityByQuizId(quizId: number): Promise<QuizEntity> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    const quizzes = await this.quizRepository.findOne({
      where: { id: quizId },
    });
    return quizzes;
  }

  async retrieveQuizEntityByChoiceId(choiceId: number): Promise<QuizEntity> {
    // 문제와 해당 문제에 대한 선택지, 정답 여부, 해설 가져오기
    try {
      // 선택지 ID에 해당하는 선택지 엔티티 가져오기
      const choice = await this.choiceRepository.findOne({
        where: { id: choiceId },
        relations: ['quiz'],
      });
      if (!choice) {
        throw new Error('Choice not found');
      }

      // 선택지에 연결된 퀴즈 엔티티 반환
      return choice.quiz;
    } catch (error) {
      console.error('Failed to retrieve quiz entity by choice ID:', error);
      // 필요에 따라 예외 처리
      throw error; // 혹은 다른 예외 처리 방법을 사용할 수 있습니다.
    }
  }

  async updateRecommandation(
    memberId: number,
    quizSetId: number,
  ): Promise<number> {
    try {
      const existingRecommendation =
        await this.recommendationRepository.findOne({
          where: {
            member: { id: memberId },
            quizSet: { id: quizSetId },
          },
        });

      if (!existingRecommendation) {
        const newRecommendation = this.recommendationRepository.create({
          member: { id: memberId },
          quizSet: { id: quizSetId },
        });
        await this.recommendationRepository.save(newRecommendation);
        return 1; // Up
      } else {
        await this.recommendationRepository.remove(existingRecommendation);
        return -1; // Down
      }
    } catch (error) {
      throw new NotFoundException('Recommendation not found');
    }
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

  async insertQuizWithoutTimeConverting(
    quiz: NoTimeConvertingQuizDTO,
    quizSetsId: number,
  ): Promise<number> {
    const quizSets = await this.quizSetRepository.findOne({
      where: { id: quizSetsId },
    });
    if (!quizSets) {
      throw new Error('quizSets not found');
    }
    // 존재하지 않는다면 새로운 MainLectureEntity를 생성하고 저장.
    const newQuizzes = this.quizRepository.create({
      quizSet: quizSets,
      instruction: quiz.instruction,
      commentary: quiz.commentary,
      popupTime: quiz.popupTime,
    });
    await this.quizRepository.save(newQuizzes);
    return newQuizzes.id;
  }

  async checkAccess(memberId: number, quizSetId: number): Promise<boolean> {
    try {
      const quizSet = await this.quizSetRepository.findOne({
        where: { id: quizSetId, member: { id: memberId } },
      });
      return !!quizSet;
    } catch (error) {
      console.error('Access check failed:', error);
      return false;
    }
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

  async deleteQuizSet(quizSetId: number): Promise<void> {
    // 주어진 ID에 해당하는 문제집을 찾음
    const quizSet = await this.quizSetRepository.findOne({
      where: { id: quizSetId },
      relations: [
        'subLecture',
        'quizzes',
        'quizzes.quizResults',
        'quizzes.choices',
        'recommendations',
      ],
    });

    if (!quizSet) {
      throw new NotFoundException('QuizSet not found');
    }

    await Promise.all([
      // quizResults 삭제
      quizSet.quizzes &&
        Promise.all(
          quizSet.quizzes.map(
            (quiz) =>
              quiz.quizResults &&
              Promise.all(
                quiz.quizResults.map((quizResult) =>
                  this.quizResultRepository.remove(quizResult),
                ),
              ),
          ),
        ),
      // choices 삭제
      quizSet.quizzes &&
        Promise.all(
          quizSet.quizzes.map(
            (quiz) =>
              quiz.choices &&
              Promise.all(
                quiz.choices.map((choice) =>
                  this.choiceRepository.remove(choice),
                ),
              ),
          ),
        ),
      // quiz 삭제
      quizSet.quizzes &&
        Promise.all(
          quizSet.quizzes.map((quiz) => this.quizRepository.remove(quiz)),
        ),
      // recommendations 삭제
      quizSet.recommendations &&
        Promise.all(
          quizSet.recommendations.map((recommendation) =>
            this.recommendationRepository.remove(recommendation),
          ),
        ),
      // QuizSetEntity 삭제
      this.quizSetRepository.remove(quizSet),
    ]);

    console.log('삭제되었습니다');
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
        choices: choiceDetails,
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

    // recommendationCount를 기준으로 내림차순 정렬
    allQuizSet.sort((a, b) => b.recommendationCount - a.recommendationCount);

    // 상위 4개의 요소만 선택
    const topFourQuizSets = allQuizSet.slice(0, 4);

    return topFourQuizSets;
  }

  /**
   * 문제집이 이미 있으면 해당 문제집의 id를 반환하고 없으면 새로 생성한 문제집 엔터티를 반환한다.
   * @param title 문제집명
   * @param subLecture 소강의 엔터티
   * @param member 회원 엔터티
   * @returns 생성된 문제집 엔터티
   */
  async upsertQuizSets(
    title: string,
    subLecture: SubLectureEntity,
    member: MemberEntity,
  ): Promise<QuizSetEntity> {
    const existingQuizSets = await this.quizSetRepository.findOne({
      where: {
        title,
        member: { id: member.id },
        subLecture: { id: subLecture.id },
      },
    });
    if (existingQuizSets) {
      return existingQuizSets;
    }
    const newQuizSets = this.quizSetRepository.create({
      title,
      member,
      subLecture: { id: subLecture.id },
    });
    return await this.quizSetRepository.save(newQuizSets);
  }

  async upsertQuizSetWithQuiz(
    title: string,
    subLecture: SubLectureEntity,
    member: MemberEntity,
    quiz: NoTimeConvertingQuizDTO,
  ): Promise<NoTimeConvertingQuizDTO> {
    const quizSets = await this.upsertQuizSets(title, subLecture, member);
    const quizzesId = await this.insertQuizWithoutTimeConverting(
      quiz,
      quizSets.id,
    );
    for (let j = 0; j < quiz.choices.length; j++) {
      await this.insertChoices(quiz.choices[j], quizzesId);
    }
    return quiz;
  }

  async timeToGoBack(quizId: number): Promise<number> {
    // 주어진 quizId에 해당하는 퀴즈 엔티티를 찾음
    console.log(quizId);
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['quizSet'],
    });
    console.log('quiz: ', quiz);

    // 주어진 quizId에 해당하는 퀴즈가 없을 경우
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }

    // 같은 quizSet에 속하면서 popupTime이 가장 작은 퀴즈를 찾음
    const earliestQuiz = await this.quizRepository.findOne({
      where: {
        quizSet: quiz.quizSet,
      },
      order: {
        popupTime: 'ASC',
      },
    });

    // 같은 quizSet에 속하면서 popupTime이 가장 작은 퀴즈가 주어진 퀴즈인 경우
    if (earliestQuiz.id === quiz.id) {
      return 0; // 이미 가장 빠른 퀴즈인 경우 0 반환
    }

    // 같은 quizSet에 속하면서 popupTime이 가장 작은 퀴즈를 찾은 경우
    // 해당 퀴즈의 popupTime 반환
    return earliestQuiz.popupTime;
  }
}
