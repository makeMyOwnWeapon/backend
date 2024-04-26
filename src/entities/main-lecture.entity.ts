import { Column, Entity, OneToMany } from 'typeorm';
import { SubLectureEntity } from './sub-lecture.entity';
import { DefaultEntity } from './default-entity';

@Entity('main_lectures')
export class MainLectureEntity extends DefaultEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  lecturer_name: string;

  @OneToMany(() => SubLectureEntity, (subLecture) => subLecture.mainLecture)
  subLectures: SubLectureEntity[];
}
