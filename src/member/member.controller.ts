import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from './member.service';
import { JwtService } from '@nestjs/jwt';
import { FetchOAuthIdResponseDto } from './dto/fetchOAuthIdResponse.dto';
import { Public } from 'src/auth/auth.guard';

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

  private extractIdFromToken(authHeader: string): string | null {
    const token = authHeader?.split(' ')[1]; // Bearer 토큰 추출
    if (!token) {
      return null;
    }
    try {
      const memberId = this.jwtService.decode(token).id;
      return memberId;
    } catch (error) {
      return null;
    }
  }

  private extractToken(authHeader: string): string | null {
    return authHeader?.split(' ')[1];
  }

  @Post('/delete')
  async deleteMember(@Headers('Authorization') authHeader: string) {
    const memberId = this.extractIdFromToken(authHeader);
    return this.memberService.deleteMember(memberId);
  }

  @Public()
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

  @Public()
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

  @Get('/oauthId')
  async getOAuthId(
    @Headers('Authorization') authHeader: string,
  ): Promise<FetchOAuthIdResponseDto> {
    if (!authHeader) {
      throw new BadRequestException('인증 헤더값이 없습니다.');
    }
    const token = this.extractToken(authHeader); // Bearer 토큰 추출
    try {
      const memberId = this.jwtService.decode(token).id;
      return this.memberService.retrieveOAuthId(memberId);
    } catch (ignore) {
      throw new BadRequestException('잘못된 토큰입니다.');
    }
  }
}
