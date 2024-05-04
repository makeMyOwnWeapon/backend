import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';
import { LectureHistoryEntity } from './lecture-history.entity';

@Entity('video_analytics_histories')
export class VideoAnalyticsHistoryEntity extends DefaultEntity {
  @ManyToOne(() => MemberEntity, (member) => member.videoAnalyticsHistories)
  @JoinColumn()
  member: MemberEntity;

  @ManyToOne(
    () => SubLectureEntity,
    (subLecture) => subLecture.videoAnalyticsHistories,
  )
  @JoinColumn()
  subLecture: SubLectureEntity;

  @ManyToOne(
    () => LectureHistoryEntity,
    (lectureHistories) => lectureHistories.videoAnalyticsHistories,
  )
  @JoinColumn()
  lectureHistories: LectureHistoryEntity;

  @Column('datetime', { nullable: false })
  startedAt: Date;

  @Column('datetime', { nullable: false })
  endedAt: Date;

  @Column({ nullable: false })
  analysisType: number;
}
