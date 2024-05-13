import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt } from 'class-validator';

export class ChoiceDetailResponseDTO {
  @ApiProperty({ description: '선택지 식별자' })
  @IsInt()
  choiceId: number;

  @ApiProperty({ description: '선택지 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '이 선택지가 답인지 아닌지' })
  @IsBoolean()
  isAnswer: boolean;
}

export class CreateChoiceRequestDTO {
  @ApiProperty({ description: '선택지 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '이 선택지가 답인지 아닌지' })
  @IsBoolean()
  isAnswer: boolean;
}
