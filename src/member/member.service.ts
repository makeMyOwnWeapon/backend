import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';
import { SigninDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async signup(memberEntity: MemberEntity): Promise<SigninDto> {
    const result = await this.memberRepository.save(memberEntity);
    if (!result) {
      return null;
    }
    const { id, authorizationCode, nickname } = result;
    return { id, authorizationCode, nickname };
  }

  async signin(oauthId: string): Promise<SigninDto> {
    const result = await this.memberRepository.findOne({
      where: { oauthId },
    });
    if (!result) {
      return null;
    }
    const { id, authorizationCode, nickname } = result;
    return { id, authorizationCode, nickname };
  }
}
