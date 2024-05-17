import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { LectureHistoryEntity } from './lecture-history.entity';

@Entity('gpt_comments')
export class GptCommentEntity extends DefaultEntity {
  @ManyToOne(
    () => LectureHistoryEntity,
    (lectureHistory) => lectureHistory.gptComments,
  )
  @JoinColumn({ name: 'lecture_history_id' })
  lectureHistory: LectureHistoryEntity;

  @Column({ type: 'varchar', length: 255 })
  gptKeyword: string;

  @Column({ type: 'varchar', length: 255 })
  gptCommentary: string;
}
