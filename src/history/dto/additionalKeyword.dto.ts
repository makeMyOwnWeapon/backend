import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class AddtionalKeywordResponseDTO {
  @ApiProperty({ description: '키워드 내용' })
  @IsString()
  content: string;
}

export class AdditionalKeywordsResponseDTO {
  // TODO: 변수명 변경!
  @ApiProperty({ description: '추가 공부 키워드' })
  @ValidateNested()
  @Type(() => AddtionalKeywordResponseDTO)
  choices: AddtionalKeywordResponseDTO[];
}
