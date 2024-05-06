import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LectureHistoryResponseDto {
  @ApiProperty({ description: 'lectureHistoryId' })
  @IsInt()
  lectureHistoryId: number;
}
