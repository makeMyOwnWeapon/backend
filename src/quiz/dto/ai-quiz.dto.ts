import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { SummaryDTO } from './quiz.dto';
import { Type } from 'class-transformer';
import { ChoiceDetailResponseDTO } from './choice.dto';

export class AIQuizCreateRequestDTO {
  @ApiProperty({ description: '소강의 식별자(id)' })
  @IsInt()
  subLectureId: number;

  @ApiProperty({ description: '강의 스크립트' })
  @IsString()
  script: string;

  @ApiProperty({ description: '팝업될 시각' })
  @IsInt()
  popupTime: number;
}

export class AIQuizCreateResponseDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간(초단위 정수)' })
  @IsString()
  popupTime: number;

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => ChoiceDetailResponseDTO)
  choices: ChoiceDetailResponseDTO[];
}

export class AISummaryCreateResponseDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간(초단위 정수)' })
  @IsString()
  popupTime: number;

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => SummaryDTO)
  choices: SummaryDTO[];
}
