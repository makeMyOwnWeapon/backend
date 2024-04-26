import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';
import { DefaultEntity } from './default-entity';

@Entity('lecture_histories')
export class LectureHistoryEntity extends DefaultEntity {
  @Column({ type: 'date', nullable: false })
  completionDate: string;

  @Column({ nullable: false })
  totalLearningTime: number;

  @ManyToOne(() => SubLectureEntity, (subLecture) => subLecture.histories)
  @JoinColumn()
  subLecture: SubLectureEntity;

  @ManyToOne(() => MemberEntity, (member) => member.lectureHistories)
  @JoinColumn()
  member: MemberEntity;
}
