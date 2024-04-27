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
    const token = authHeader?.split(' ')[1]?.split('.')[1]; // Bearer 토큰 추출
    if (!token) {
      return null;
    }
    try {
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      const sub = JSON.parse(decodedToken).sub;
      console.log('Received decodedToken:', sub);
      return sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  async createToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  @Post('/signup')
  createMember(
    @Body() memberEntity: MemberEntity,
    @Headers('Authorization') authHeader: string,
  ) {
    console.log('authHeader: ', authHeader);
    console.log(memberEntity);
    const sub = this.extractSubFromToken(authHeader);
    if (!sub) {
      return 'Invalid token';
    }
    memberEntity.oauthId = sub;
    const member = JSON.stringify(this.memberService.signup(memberEntity));
    // JWT 토큰 생성
    const base64Token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      Buffer.from(member).toString('base64');
    +'.xWecGOQE9-acSXySO-BEtoIuDUQXaNwSa8YVgp6jfag';
    console.log('base64Token: ', base64Token);

    return base64Token;
  }

  @Get('/signin')
  async getMember(@Headers('Authorization') authHeader: string) {
    console.log(authHeader);
    const sub = this.extractSubFromToken(authHeader);
    if (!sub) {
      return null;
    }
    const oauthId = sub; // JWT 토큰에서 "sub" 값을 가져옴
    const member = JSON.stringify(await this.memberService.signin(oauthId));
    console.log('member: ', member);

    // JWT 토큰 생성
    const base64Token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      Buffer.from(member).toString('base64');
    +'.xWecGOQE9-acSXySO-BEtoIuDUQXaNwSa8YVgp6jfag';
    console.log('base64Token: ', base64Token);
    return base64Token;
  }
}
