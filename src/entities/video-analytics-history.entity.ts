import { Column, Entity } from 'typeorm';
import { DefaultEntity } from './default-entity';

@Entity('video_analytics_histories')
export class VideoAnalyticsHistoryEntity extends DefaultEntity {
  @Column('datetime', { nullable: false })
  startedAt: Date;

  @Column('datetime', { nullable: false })
  endedAt: Date;

  @Column({ nullable: false })
  analysisType: number;
}
