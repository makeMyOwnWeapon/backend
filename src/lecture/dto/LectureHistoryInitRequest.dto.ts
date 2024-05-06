import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LectureHistoryInitRequestDto {
  @ApiProperty({ description: '소강의URL' })
  @IsString()
  subLectureUrl: string;
  @ApiProperty({ description: '분석시작시각' })
  @IsDateString()
  startedAt: Date;
}
