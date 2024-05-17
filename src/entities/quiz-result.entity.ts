import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { ChoiceEntity } from './choice.entity';
import { QuizEntity } from './quiz.entity';
import { LectureHistoryEntity } from './lecture-history.entity';

@Entity('quiz_results')
export class QuizResultEntity extends DefaultEntity {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizResults)
  @JoinColumn()
  quiz: QuizEntity;

  @ManyToOne(
    () => LectureHistoryEntity,
    (lectureHistories) => lectureHistories.quizResults,
  )
  @JoinColumn()
  lectureHistories: LectureHistoryEntity;

  @ManyToOne(() => ChoiceEntity, (choice) => choice.quizResult)
  @JoinColumn()
  choice: ChoiceEntity;

  @Column({ nullable: false })
  isCorrect: boolean;

  @Column({ nullable: false })
  solvedDuration: number;
}
