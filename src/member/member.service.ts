import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';
import { SigninDto } from './dto/member.dto';
import { FetchOAuthIdResponseDto } from './dto/fetchOAuthIdResponse.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}
  async retrieveMemberEntity(memberId): Promise<MemberEntity> {
    const memberEntity = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!memberEntity) {
      throw new Error('member not found');
    }
    return memberEntity;
  }

  async deleteMember(memberId): Promise<number> {
    const memberEntity = await this.retrieveMemberEntity(memberId);
    memberEntity.oauthId = '0';
    await this.memberRepository.save(memberEntity);
    return 1;
  }

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

  async retrieveOAuthId(memberId: number): Promise<FetchOAuthIdResponseDto> {
    return await this.memberRepository.findOne({
      select: { oauthId: true },
      where: { id: memberId },
    });
  }
}
