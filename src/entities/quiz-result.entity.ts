import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { ChoiceEntity } from './choice.entity';
import { QuizEntity } from './quiz.entity';
import { MemberEntity } from './member.entity';

@Entity('quiz_results')
export class QuizResultEntity extends DefaultEntity {
  @ManyToOne(() => MemberEntity, (member) => member.quizResults)
  @JoinColumn()
  member: MemberEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizResults)
  @JoinColumn()
  quiz: QuizEntity;

  @OneToOne(() => ChoiceEntity)
  @JoinColumn()
  choice: ChoiceEntity;

  @Column({ nullable: false })
  isCorrect: boolean;

  @Column({ nullable: false })
  solvedDuration: number;
}
