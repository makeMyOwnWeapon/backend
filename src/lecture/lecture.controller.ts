import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
  @Get('/sub-lecture')
  retrieveLecture(
    @Query('url') url: string,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    return this.lectureService.retrieveSubLectureId(decodeURIComponent(url));
  }

  @Post('/sub-lecture/history')
  connectHistory(
    @Req() req: UserRequest,
    @Body() dto: SubLectureIdRetrieveResponseDto,
  ): Promise<LectureHistoryResponseDto> {
    const startTime = this.parseDateString(dto.startedAt);
    return this.lectureService.initializeLectureHistory(
      this.memberService.retrieveMemberEntity(req.user.id),
      dto.subLectureId,
      startTime,
    );
  }

  @Patch('sub-lecture/history')
  async disconnectHistory(
    @Req() req: UserRequest,
    @Body() dto: LectureHistoryResponseDto,
  ): Promise<LectureHistoryResponseDto> {
    const endTime = this.parseDateString(dto.endedAt);
    return this.lectureService.finalizeLectureHistory(
      dto.lectureHistoryId,
      endTime,
    );
  }

  parseDateString(dateString: string): Date {
    const datePart = dateString.substring(0, 8);
    const timePart = dateString.substring(9);

    const year = parseInt(datePart.substring(0, 4), 10);
    const month = parseInt(datePart.substring(4, 6), 10) - 1;
    const day = parseInt(datePart.substring(6, 8), 10);

    const hours = parseInt(timePart.substring(0, 2), 10);
    const minutes = parseInt(timePart.substring(3, 5), 10);
    const seconds = parseInt(timePart.substring(6, 8), 10);

    return new Date(year, month, day, hours, minutes, seconds);
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