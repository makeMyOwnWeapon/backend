// @ts-ignore

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AnalyticsOccurRequestDto } from './dto/AnalyticsOccurRequest.dto';
import { MemberService } from '../member/member.service';
import { LectureService } from '../lecture/lecture.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { UserRequest } from '../auth/UserRequest';
import { Response } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private jwtService: JwtService,
    private memberService: MemberService,
    private lectureService: LectureService,
    private analyticsService: AnalyticsService,
  ) {}

  @Get()
  async checkHealth(@Req() req: UserRequest): Promise<string> {
    const memberId = req.user.id;
    const memberEntity =
      await this.memberService.retrieveMemberEntity(memberId);

    return 'OK';
  }

  @Post('/occur')
  async handleAnalyticsOccur(
    @Req() req: UserRequest,
    @Body() analyticsOccurRequestDto: AnalyticsOccurRequestDto,
    @Res() res: Response,
  ) {
    try {
      const memberId = req.user.id;
      const memberEntity =
        await this.memberService.retrieveMemberEntity(memberId);
      const sub_lecture_entity =
        await this.lectureService.retrieveSubLectureEntity(
          Number(analyticsOccurRequestDto.sublectureId),
        );
      const videoAnalyticsHistoryEntity = analyticsOccurRequestDto.toEntity(
        sub_lecture_entity,
        memberEntity,
      );
      await this.analyticsService.saveVideoAnalyticsHistory(
        videoAnalyticsHistoryEntity,
      );

      return res.status(HttpStatus.OK).json({
        message: '데이터가 성공적으로 처리되었습니다.',
        data: analyticsOccurRequestDto,
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '데이터 처리 중 오류가 발생했습니다.',
      });

      return res;
    }
  }

  // @Get('extension')
  // async authForExtension(@Headers('Authorization') authHeader: string, @Res() res: Response): Promise<ExtensionAuthResponseDto | Response<void>> {
  //   if (!authHeader) {
  //     return res.status(HttpStatus.BAD_REQUEST).send();
  //   }
  //   const signinDto = await this.memberService.signin(authHeader);
  //   if (!signinDto) {
  //     return res.status(HttpStatus.NO_CONTENT).send();
  //   }
  //   const token = this.jwtService.sign(signinDto, {
  //     expiresIn: this.configService.get('EXTENSION_EXPIRES_IN'),
  //   });
  //   return res.send({ token });
  // }
}
