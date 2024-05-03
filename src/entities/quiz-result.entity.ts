import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { ChoiceEntity } from './choice.entity';
import { QuizEntity } from './quiz.entity';
import { MemberEntity } from './member.entity';
import { LectureHistoryEntity } from './lecture-history.entity';

@Entity('quiz_results')
export class QuizResultEntity extends DefaultEntity {
  @ManyToOne(() => MemberEntity, (member) => member.quizResults)
  @JoinColumn()
  member: MemberEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizResults)
  @JoinColumn()
  quiz: QuizEntity;

  @ManyToOne(
    () => LectureHistoryEntity,
    (lecture_histories) => lecture_histories.quizResults,
  )
  @JoinColumn()
  lecture_histories: LectureHistoryEntity;

  @OneToOne(() => ChoiceEntity)
  @JoinColumn()
  choice: ChoiceEntity;

  @Column({ nullable: false })
  isCorrect: boolean;

  @Column({ nullable: false })
  solvedDuration: number;
}
