import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';

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

  @Column('datetime', { nullable: false })
  startedAt: Date;

  @Column('datetime', { nullable: false })
  endedAt: Date;

  @Column({ nullable: false })
  analysisType: number;
}
