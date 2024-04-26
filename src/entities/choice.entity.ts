import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { QuizEntity } from './quiz.entity';

@Entity('choices')
export class ChoiceEntity extends DefaultEntity {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.choices)
  @JoinColumn()
  quiz: QuizEntity;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  isAnswer: boolean;
}
