import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Public } from 'src/auth/auth.guard';
import { AnalyticsResultResponseDto } from './dto/AnalyticsResultResponse.dto';

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
      //const lectureHistoryId = this.appGateway.getLectureHistoryId(memberId);
      //pppppppppppppppppppppppppppppppppppp
      // if (!lectureHistoryId) {
      //   return res.status(HttpStatus.NOT_FOUND).json({
      //     message: '수강 기록을 찾을 수 없습니다.',
      //   });
      // }
      // const lectureHistoryEntity =
      //   await this.historyService.retrieveLectureHistoryEntity(
      //     lectureHistoryId,
      //   );
      // const videoAnalyticsHistoryEntity =
      //   analyticsSaveRequestDto.toEntity(lectureHistoryEntity);
      // await this.analyticsService.saveVideoAnalyticsHistory(
      //   videoAnalyticsHistoryEntity,
      // );

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

      // if (!this.appGateway.isConnected(memberId)) {
      //   throw new Error('소켓 연결이 없습니다.');
      // }

      //todo: HTTP로 꺠우는 로직 추가
      
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: '알람 울림을 실패했습니다.',
        error: error.message,
      });
    }
  }

  @Public()
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AnalyticsResultResponseDto> {
    console.log('client file: ', file);
    return this.analyticsService.processImage(file);
  }
}
