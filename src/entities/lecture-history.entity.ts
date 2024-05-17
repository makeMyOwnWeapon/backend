import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';
import { DefaultEntity } from './default-entity';
import { QuizResultEntity } from './quiz-result.entity';
import { VideoAnalyticsHistoryEntity } from './video-analytics-history.entity';
import { GptCommentEntity } from './gpt-comment.entity';

@Entity('lecture_histories')
export class LectureHistoryEntity extends DefaultEntity {
  @Column('datetime', { nullable: false })
  startedAt: Date;

  @Column('datetime', { nullable: true })
  endedAt: Date;

  @ManyToOne(() => SubLectureEntity, (subLecture) => subLecture.histories)
  @JoinColumn()
  subLecture: SubLectureEntity;

  @ManyToOne(() => MemberEntity, (member) => member.lectureHistories)
  @JoinColumn()
  member: MemberEntity;

  @OneToMany(
    () => QuizResultEntity,
    (quizResultEntity) => quizResultEntity.lectureHistories,
  )
  quizResults: QuizResultEntity[];

  @OneToMany(
    () => VideoAnalyticsHistoryEntity,
    (videoAnalyticsHistoryEntity) =>
      videoAnalyticsHistoryEntity.lectureHistories,
  )
  videoAnalyticsHistories: VideoAnalyticsHistoryEntity[];

  @OneToMany(
    () => GptCommentEntity,
    (gptCommentEntity) => gptCommentEntity.lectureHistory,
  )
  gptComments: GptCommentEntity;
}
