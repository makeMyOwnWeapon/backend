import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LectureHistorySaveRequestDto {
  @ApiProperty({ description: '분석종료시각' })
  @IsDateString()
  endedAt: Date;
}
