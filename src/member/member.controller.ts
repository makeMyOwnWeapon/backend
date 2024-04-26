import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('/create')
  createMember(@Body() memberEntity: MemberEntity) {
    return this.memberService.createMember(memberEntity);
  }

  @Get('/getMember/:email')
  async getMember(@Param('oauthId') oauthId: string) {
    const member = await this.memberService.getMember(oauthId);
    console.log(member);
    return member;
  }
}
