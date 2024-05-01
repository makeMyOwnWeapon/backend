import { Column, Entity, OneToMany } from 'typeorm';
import { LectureHistoryEntity } from './lecture-history.entity';
import { GptUsageHistoryEntity } from './gpt-usage-history';
import { DefaultEntity } from './default-entity';
import { QuizSetEntity } from './quiz-set.entity';
import { RecommendationEntity } from './recommendation-entity';
import { QuizResultEntity } from './quiz-result.entity';
import { VideoAnalyticsHistoryEntity } from './video-analytics-history.entity';

@Entity('members')
export class MemberEntity extends DefaultEntity {
  @Column()
  oauthId: string;

  @Column({ nullable: false })
  authorizationCode: number;

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

  @OneToMany(
    () => VideoAnalyticsHistoryEntity,
    (videoAnalyticsHistories) => videoAnalyticsHistories.member,
  )
  videoAnalyticsHistories: VideoAnalyticsHistoryEntity[];

  @OneToMany(() => QuizSetEntity, (quizSets) => quizSets.member)
  quizSets: QuizSetEntity[];

  @OneToMany(
    () => RecommendationEntity,
    (recommendations) => recommendations.member,
  )
  recommendations: RecommendationEntity[];

  @OneToMany(() => QuizResultEntity, (quizResults) => quizResults.member)
  quizResults: QuizResultEntity[];


}
