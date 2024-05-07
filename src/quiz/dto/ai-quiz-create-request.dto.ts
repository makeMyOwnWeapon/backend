import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AIQuizCreateRequestDTO {
  @ApiProperty({ description: '소강의 식별자(id)' })
  @IsInt()
  subLectureId: number;

  @ApiProperty({ description: '강의 스크립트' })
  @IsString()
  script: string;

  @ApiProperty({ description: '팝업될 시각' })
  @IsString()
  popuptime: string;
}
