import { Controller, Get, Headers, HttpStatus, Res } from '@nestjs/common';
import { ExtensionAuthResponseDto } from './dto/ExtensionAuthResponse.dto';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Public } from 'src/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('extension')
  async authForExtension(
    @Headers('Authorization') authHeader: string,
    @Res() res: Response,
  ): Promise<ExtensionAuthResponseDto | Response<void>> {
    if (!authHeader) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
    const signinDto = await this.memberService.signin(authHeader);
    if (!signinDto) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    const token = this.jwtService.sign(signinDto, {
      expiresIn: this.configService.get('EXTENSION_EXPIRES_IN'),
    });
    return res.send({ token });
  }
}
