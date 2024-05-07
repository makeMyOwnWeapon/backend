import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class SubLectureCreateRequestDto {
  @ApiProperty({ description: '소강의 url' })
  @IsString()
  url: string;

  @ApiProperty({ description: '소강의명' })
  @IsString()
  title: string;

  @ApiProperty({ description: '강의 시간 (초 단위)' })
  @IsInt()
  duration: number;
}
