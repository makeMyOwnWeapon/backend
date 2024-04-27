import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  signup(memberEntity): Promise<MemberEntity> {
    return this.memberRepository.save(memberEntity);
  }

  async signin(oauthId): Promise<MemberEntity> {
    const result = await this.memberRepository.findOne({
      where: { oauthId },
    });
    return result;
  }
}
