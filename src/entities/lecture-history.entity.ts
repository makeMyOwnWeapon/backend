import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';
import { DefaultEntity } from './default-entity';

@Entity('lecture_histories')
export class LectureHistoryEntity extends DefaultEntity {
  @Column('datetime', { nullable: false })
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @ManyToOne(() => SubLectureEntity, (subLecture) => subLecture.histories)
  @JoinColumn()
  subLecture: SubLectureEntity;

  @ManyToOne(() => MemberEntity, (member) => member.lectureHistories)
  @JoinColumn()
  member: MemberEntity;
}
