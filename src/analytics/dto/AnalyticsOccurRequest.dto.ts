import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AnalyticsOccurRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly startAt: string;

  @IsNotEmpty()
  @IsString()
  readonly endAt: string;

  @IsNotEmpty()
  @IsString()
  readonly analysisType: string;

  @IsNotEmpty()
  @IsString()
  readonly sublectureId?: string;
}
