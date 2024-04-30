import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from './member.service';
import { JwtService } from '@nestjs/jwt';

@Controller('member')
export class MemberController {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  private extractSubFromToken(authHeader: string): string | null {
    const token = authHeader?.split(' ')[1]; // Bearer 토큰 추출
    if (!token) {
      return null;
    }
    try {
      const sub = this.jwtService.decode(token).sub;
      return sub;
    } catch (error) {
      return null;
    }
  }

  @Post('/signup')
  async createMember(
    @Body() memberEntity: MemberEntity,
    @Headers('Authorization') authHeader: string,
  ) {
    const oauthId = this.extractSubFromToken(authHeader);
    if (!oauthId) {
      return 'Invalid token';
    }
    memberEntity.oauthId = oauthId;
    const member = await this.memberService.signup(memberEntity);
    if (!member) {
      return null;
    }
    // JWT 토큰 생성
    const token = this.jwtService.sign(member);
    const decodedToken = this.jwtService.decode(token);
    return { token, expire: decodedToken.exp - decodedToken.iat };
  }

  @Get('/signin')
  async getMember(@Headers('Authorization') authHeader: string) {
    const oauthId = this.extractSubFromToken(authHeader);
    const member = await this.memberService.signin(oauthId);
    if (!member) {
      return null;
    }
    // JWT 토큰 생성
    const token = this.jwtService.sign(member);
    const decodedToken = this.jwtService.decode(token);
    return { token, expire: decodedToken.exp - decodedToken.iat };
  }
}
