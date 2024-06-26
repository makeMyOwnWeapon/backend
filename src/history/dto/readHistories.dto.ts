import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadHistoriesDTO {
  @ApiProperty({ description: 'lectureHistoryId' })
  @IsInt()
  lectureHistoryId: number;
  @ApiProperty({ description: 'subLectureId' })
  @IsInt()
  subLectureId: number;
  @ApiProperty({ description: '소강의 제목' })
  @IsString()
  subLectureTitle: string;
  @ApiProperty({ description: '레포트 등록 일자' })
  @IsString()
  registrationDate: Date;
}
