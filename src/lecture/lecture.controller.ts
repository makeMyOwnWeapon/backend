import { Controller, Get, Param, Post, Query, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { OnEvent } from '@nestjs/event-emitter';
//ppppppppppppppppp

import { LectureService } from './lecture.service';
import { MemberService } from 'src/member/member.service';
import { SubLectureIdRetrieveResponseDto } from './dto/SubLectureIdRetrieveResponse.dto';
import { SubLectureCreateRequestDto } from './dto/SubLectureCreateRequest.dto';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';
import { UserRequest } from '../auth/UserRequest';

@ApiTags('lectures')
@Controller('lecture')
export class LectureController {
  constructor(
    private lectureService: LectureService,
    private memberService: MemberService,
  ) {}

  onModuleInit() {}

  // @OnEvent('member.disconnect')
  // handleMemberDisconnect(payload: any) {
  //   return this.lectureService.finalizeLectureHistory(payload.lectureHistoryId);
  // }
  //pppppppppppppppppppppppppppppppppppp

  // @OnEvent('member.connection')
  // handleMemberConnection(payload: any) {
  //   return this.lectureService.initializeLectureHistory(
  //     this.memberService.retrieveMemberEntity(payload.memberId),
  //     payload.subLectureId,
  //   );
  // }

  @Get('/sub-lecture')
  retrieveLecture(
    @Query('url') url: string,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    return this.lectureService.retrieveSubLectureId(decodeURIComponent(url));
  }

  @Get('/sub-lecture/history')
  retrieveHistory(
    @Req() req: UserRequest,
    @Body() dto: SubLectureIdRetrieveResponseDto,
  ): Promise<LectureHistoryResponseDto> {
    return this.lectureService.initializeLectureHistory(
      this.memberService.retrieveMemberEntity(req.user.id),
      dto.subLectureId,
    );
  }

  @Post('/main-lecture/:mainLectureTitle/sub-lecture')
  createSubLecture(
    @Param('mainLectureTitle') mainLectureTitle: string,
    @Body() dto: SubLectureCreateRequestDto,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    return this.lectureService.createSubLecture(
      decodeURIComponent(mainLectureTitle),
      dto,
    );
  }
}
