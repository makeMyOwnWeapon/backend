import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateRecommendationRequestDTO {
  @ApiProperty({ description: '현재 추천수' })
  @IsInt()
  numOfRecommendation: number;
  @ApiProperty({ description: 'quizSetId' })
  @IsInt()
  quizSetId: number;
}
