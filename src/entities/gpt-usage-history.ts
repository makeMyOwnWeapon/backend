import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MemberEntity } from './member.entity';
import { DefaultEntity } from './default-entity';

@Entity('gpt_usage_histories')
export class GptUsageHistoryEntity extends DefaultEntity {
  @ManyToOne(() => MemberEntity, (member) => member.gptUsageHistories)
  @JoinColumn()
  member: MemberEntity;
}
