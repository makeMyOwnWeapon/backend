import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtService } from '@nestjs/jwt';
import { FetchOAuthIdResponseDto } from './dto/fetchOAuthIdResponse.dto';
import { Public } from 'src/auth/auth.guard';
import { UserRequest } from '../auth/UserRequest';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignupDto, Signup2Dto } from './dto/member.dto';

@ApiTags('members')
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

  private extractToken(authHeader: string): string | null {
    return authHeader?.split(' ')[1];
  }

  @Post('/delete')
  @ApiOperation({
    summary: '회원탈퇴',
    description: '회원탈퇴',
  })
  async deleteMember(@Req() req: UserRequest) {
    const memberId = req.user.id;
    return this.memberService.deleteMember(memberId);
  }

  @Public()
  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '사용자 정보를 추가합니다.',
  })
  @ApiBody({ type: Signup2Dto })
  @ApiResponse({ status: 201, description: '회원가입에 성공하였습니다' })
  @ApiResponse({ status: 400, description: '회원가입에 실패하였습니다' })
  @ApiBearerAuth()
  async createMember(
    @Req() req: UserRequest,
    @Body() userInfo: Signup2Dto,
    @Headers('Authorization') authHeader: string,
  ) {
    const oauthId = this.extractSubFromToken(authHeader);
    if (!oauthId) {
      return 'Invalid token';
    }
    const newUserInfo: SignupDto = {
      authorizationCode: userInfo.authorizationCode,
      oauthId: oauthId,
      nickname: userInfo.nickname,
    };

    const member = await this.memberService.signup(newUserInfo);
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
  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @ApiResponse({ status: 201, description: '로그인에 성공하였습니다' })
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
  @ApiOperation({
    summary: 'oauthId를 통해 memberid추출',
    description: 'oauthId를 통해 memberid추출',
  })
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
