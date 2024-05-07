import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { LectureHistoryEntity } from './lecture-history.entity';

@Entity('video_analytics_histories')
export class VideoAnalyticsHistoryEntity extends DefaultEntity {
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
