import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { QuizSetEntity } from './quiz-set.entity';
import { ChoiceEntity } from './choice.entity';
import { QuizResultEntity } from './quiz-result.entity';

@Entity('quizzes')
export class QuizEntity extends DefaultEntity {
  @ManyToOne(() => QuizSetEntity, (quizSet) => quizSet.quizzes)
  @JoinColumn()
  quizSet: QuizSetEntity;

  @Column({ nullable: false })
  instruction: string;

  @Column()
  commentary: string;

  @Column({ nullable: false })
  popupTime: number;

  @OneToMany(() => ChoiceEntity, (choice) => choice.quiz)
  choices: ChoiceEntity[];

  @OneToMany(() => QuizResultEntity, (quizResults) => quizResults.quiz)
  quizResults: QuizResultEntity[];
}
