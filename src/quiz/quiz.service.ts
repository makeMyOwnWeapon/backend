import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizSetEntity } from '../entities/quiz-set.entity';
import { ChoiceEntity } from '../entities/choice.entity';
import { RecommendationEntity } from '../entities/recommendation-entity';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberService } from 'src/member/member.service';
import { ReadQuizSetDTO } from './dto/quiz_sets.dto';

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
    private lectureService: LectureService,
    private memberService: MemberService,
  ) {}

  async insertQuizSets(title: string, subLectureId, memberId): Promise<number> {
    const subLecture =
      await this.lectureService.retrieveSubLectureEntity(subLectureId);
    const member = await this.memberService.retrieveMemberEntity(memberId);

    // 주어진 title과 name으로 MainLectureEntity를 찾음.
    const existingQuizSets = await this.quizSetRepository.findOne({
      where: {
        title,
        member: { id: memberId },
        subLecture: { id: subLectureId },
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
      popupTime: quizzes.popupTime,
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
    });

    const allQuizSet: ReadQuizSetDTO[] = await Promise.all(
      //가져온 quiz_sets를 순회하면서 각 quiz_sets의 정보를 ReadQuizSetDTO 형식으로 매핑
      quizSets.map(async (quizSet) => {
        //quizSets을 순회하면서 각 요소인 quizSet에 접근하여 필요로하는 값들을 리턴
        const recommendationCount = await this.recommendationRepository.count({
          where: { quizSet: { id: quizSet.id } },
        });
        return {
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
}
