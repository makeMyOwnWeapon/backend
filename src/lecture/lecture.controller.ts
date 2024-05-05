import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { UserRequest } from '../auth/UserRequest';
import { LectureHistoryInitRequestDto } from './dto/LectureHistoryInitRequest.dto';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';
import { LectureHistorySaveRequestDto } from './dto/LectureHistorySaveRequest.dto';
import { LectureService } from './lecture.service';
import { MemberService } from 'src/member/member.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private lectureService: LectureService,
    private memberService: MemberService,
  ) {}

  @Post('/sub-lecture/history')
  initHistory(
    @Req() req: UserRequest,
    @Body() dto: LectureHistoryInitRequestDto,
  ): Promise<LectureHistoryResponseDto> {
    const memberId = req.user.id;
    return this.lectureService.initializeLectureHistory(
      dto,
      this.memberService.retrieveMemberEntity(memberId),
    );
  }

  @Patch('/sub-lecture/history/:lectureHistoryId')
  saveHistory(
    @Param('lectureHistoryId') lectureHistoryId: number,
    @Body() dto: LectureHistorySaveRequestDto,
  ): Promise<LectureHistoryResponseDto> {
    return this.lectureService.finalizeLectureHistory(lectureHistoryId, dto);
  }
}
