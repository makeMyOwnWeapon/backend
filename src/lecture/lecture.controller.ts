import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';
import { LectureHistoryInitRequestDto } from './dto/LectureHistoryInitRequest.dto';
import { LectureHistorySaveRequestDto } from './dto/LectureHistorySaveRequest.dto';

@Controller('lecture')
export class LectureController {
  constructor(private lectureService: LectureService) {}

  @Post('/sub-lecture/history')
  initHistory(
    @Req() req: Request,
    @Body() dto: LectureHistoryInitRequestDto,
  ): LectureHistoryResponseDto {
    const memberId = 1;
    // return this.lectureService.initializeLectureHistory(dto, memberId);
    return { lectureHistoryId: memberId };
  }


  @Patch('/sub-lecture/history/:lectureHistoryId')
  saveHistory(
    @Param() lectureHistoryId: number,
    @Body() dto: LectureHistorySaveRequestDto,
  ): LectureHistoryResponseDto {
    console.log(dto);
    return { lectureHistoryId: 1 };
    // return this.lectureService.initializeLectureHistory(dto);
  }
}
