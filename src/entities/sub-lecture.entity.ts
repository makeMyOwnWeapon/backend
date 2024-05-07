import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MainLectureEntity } from './main-lecture.entity';
import { LectureHistoryEntity } from './lecture-history.entity';
import { DefaultEntity } from './default-entity';
import { QuizSetEntity } from './quiz-set.entity';

@Entity('sub_lectures')
export class SubLectureEntity extends DefaultEntity {
  @ManyToOne(() => MainLectureEntity, (mainLecture) => mainLecture.subLectures)
  @JoinColumn()
  mainLecture: MainLectureEntity;

  @Column({ nullable: false, length: 2048 })
  url: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  duration: number;

  @OneToMany(
    () => LectureHistoryEntity,
    (lectureHistory) => lectureHistory.subLecture,
  )
  histories: LectureHistoryEntity[];

  @OneToMany(() => QuizSetEntity, (quizSets) => quizSets.subLecture)
  quizSets: QuizSetEntity[];
}
