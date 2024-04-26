import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { MemberEntity } from './member.entity';
import { QuizSetEntity } from './quiz-set.entity';

@Entity('recommendations')
export class RecommendationEntity extends DefaultEntity {
  @ManyToOne(() => MemberEntity, (member) => member.recommendations)
  @JoinColumn()
  member: MemberEntity;

  @ManyToOne(() => QuizSetEntity, (quizSet) => quizSet.recommendations)
  @JoinColumn()
  quizSet: QuizSetEntity;
}
