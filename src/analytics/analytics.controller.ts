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
import { AnalyticsSaveRequestDto } from './dto/AnalyticsSaveRequest.dto';
import { AnalyticsAlarmRequestDto } from './dto/AnalyticsAlarmRequest.dto';
import { MemberService } from '../member/member.service';
import { HistoryService } from 'src/history/history.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { UserRequest } from '../auth/UserRequest';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AppGateway } from 'src/socket/socket';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private jwtService: JwtService,
    private memberService: MemberService,
    private analyticsService: AnalyticsService,
    private historyService: HistoryService,
    private appGateway: AppGateway,
  ) {}

  @Get()
  async checkHealth(@Req() req: UserRequest): Promise<string> {
    const memberId = req.user.id;
    const memberEntity =
      await this.memberService.retrieveMemberEntity(memberId);

    return 'OK';
  }

  /**
   * 저장용
   * */
  @Post('/save')
  async handleAnalyticsSave(
    @Req() req: UserRequest,
    @Body() analyticsSaveRequestDto: AnalyticsSaveRequestDto,
    @Res() res: Response,
  ) {
    try {
      const memberId = req.user.id;
      const lectureHistoryId = this.appGateway.getLectureHistoryId(memberId);

      if (!lectureHistoryId) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: '수강 기록을 찾을 수 없습니다.',
        });
      }
      const lectureHistoryEntity =
        await this.historyService.retrieveLectureHistoryEntity(
          lectureHistoryId,
        );
      const videoAnalyticsHistoryEntity =
        analyticsSaveRequestDto.toEntity(lectureHistoryEntity);
      await this.analyticsService.saveVideoAnalyticsHistory(
        videoAnalyticsHistoryEntity,
      );

      return res.status(HttpStatus.OK).json({
        message: '데이터가 성공적으로 처리되었습니다.',
        data: analyticsSaveRequestDto,
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '데이터 처리 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 알람용
   * */
  @Post('/alarm')
  async handleAnalyticsOccur(
    @Req() req: UserRequest,
    @Body() analyticsAlarmRequestDto: AnalyticsAlarmRequestDto,
    @Res() res: Response,
  ) {
    try {
      const memberId = req.user.id;
      const memberEntity =
        await this.memberService.retrieveMemberEntity(memberId);

      // 익스텐션에서 알람 울리는 로직

      this.appGateway.wakeup(memberId);

      return res.status(HttpStatus.OK).json({
        message: '성공적으로 알람을 울렸습니다.',
        data: analyticsAlarmRequestDto,
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: '알람 울림을 실패했습니다.',
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
