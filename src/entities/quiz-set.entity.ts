import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from './default-entity';
import { SubLectureEntity } from './sub-lecture.entity';
import { MemberEntity } from './member.entity';
import { QuizEntity } from './quiz.entity';
import { RecommendationEntity } from './recommendation-entity';

@Entity('quiz_sets')
export class QuizSetEntity extends DefaultEntity {
  @ManyToOne(() => SubLectureEntity, (subLecture) => subLecture.quizSets)
  @JoinColumn()
  subLecture: SubLectureEntity;

  @ManyToOne(() => MemberEntity, (member) => member.quizSets)
  @JoinColumn()
  member: MemberEntity;

  @Column()
  title: string;

  @OneToMany(() => QuizEntity, (quizzes) => quizzes.quizSet)
  quizzes: QuizEntity[];

  @OneToMany(
    () => RecommendationEntity,
    (recommendations) => recommendations.quizSet,
  )
  recommendations: RecommendationEntity[];
}
