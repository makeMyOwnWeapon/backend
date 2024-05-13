import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChoiceDetailResponseDTO, CreateChoiceRequestDTO } from './choice.dto';

export class CreateQuizWithChoicesRequestDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간' })
  @IsString()
  popupTime: string; // 초 단위 정수(hh:mm:ss)

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => CreateChoiceRequestDTO)
  choices: CreateChoiceRequestDTO[];
}

export class QuizWithChoicesResponseDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간' })
  @IsString()
  popupTime: number; // 초 단위 정수(hh:mm:ss)

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => ChoiceDetailResponseDTO)
  choices: ChoiceDetailResponseDTO[];
}
