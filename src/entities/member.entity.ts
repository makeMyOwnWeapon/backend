import { Column, Entity, OneToMany } from 'typeorm';
import { LectureHistoryEntity } from './lecture-history.entity';
import { GptUsageHistoryEntity } from './gpt-usage-history';
import { DefaultEntity } from './default-entity';
import { QuizSetEntity } from './quiz-set.entity';
import { RecommendationEntity } from './recommendation-entity';

@Entity('members')
export class MemberEntity extends DefaultEntity {
  @Column()
  oauthId: string;

  @Column('int', { nullable: false })
  authorizationCode: AuthorizationCode;

  @Column({ nullable: false, length: 100 })
  nickname: string;

  @OneToMany(
    () => LectureHistoryEntity,
    (lectureHistory) => lectureHistory.member,
  )
  lectureHistories: LectureHistoryEntity[];

  @OneToMany(
    () => GptUsageHistoryEntity,
    (gptUsageHistory) => gptUsageHistory.member,
  )
  gptUsageHistories: GptUsageHistoryEntity[];

  @OneToMany(() => QuizSetEntity, (quizSets) => quizSets.member)
  quizSets: QuizSetEntity[];

  @OneToMany(
    () => RecommendationEntity,
    (recommendations) => recommendations.member,
  )
  recommendations: RecommendationEntity[];
}

export enum AuthorizationCode {
  STUDENT,
  TEACHER,
  AI_QUIZ_MAKER,
}
