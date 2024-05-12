import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { QuizEntity } from './quiz.entity';
import { QuizResultEntity } from './quiz-result.entity';

@Entity('choices')
export class ChoiceEntity extends DefaultEntity {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.choices)
  @JoinColumn()
  quiz: QuizEntity;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  isAnswer: boolean;

  @OneToMany(() => QuizResultEntity, (quizResult) => quizResult.choice)
  quizResult: QuizResultEntity[];
}
