import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AIResponseDTO {
  @ApiProperty({ description: 'AI가 만든 키워드' })
  @IsString()
  keyword: string;

  @ApiProperty({ description: 'AI가 만든 코멘트' })
  @IsString()
  comment: string;
}

export class AISummaryDTO {
  summary: AIResponseDTO[];
}
