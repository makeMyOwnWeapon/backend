import { Column, Entity, OneToMany } from 'typeorm';
import { LectureHistoryEntity } from './lecture-history.entity';
import { GptUsageHistoryEntity } from './gpt-usage-history';
import { DefaultEntity } from './default-entity';

@Entity('members')
export class MemberEntity extends DefaultEntity {
  @Column()
  oauthId: string;

  @Column({ nullable: false })
  authorizationCode: number;

  @Column({ nullable: false, length: 100 })
  nickname: string;

  @OneToMany(
    () => LectureHistoryEntity,
    (lectureHistory) => lectureHistory.member
  )
  lectureHistories: LectureHistoryEntity[];

  @OneToMany(
    () => GptUsageHistoryEntity,
    (gptUsageHistory) => gptUsageHistory.member
  )
  gptUsageHistories: GptUsageHistoryEntity[];
}
