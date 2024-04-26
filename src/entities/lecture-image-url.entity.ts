import { DefaultEntity } from './default-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SubLectureEntity } from './sub-lecture.entity';

@Entity('lecture_image_urls')
export class LectureImageUrlEntity extends DefaultEntity {
  @Column({ nullable: false, length: 2048 })
  url: string;

  @OneToOne(() => SubLectureEntity)
  @JoinColumn()
  subLecture: SubLectureEntity;
}
