import { IsNotEmpty, IsString, IsOptional, isNumber, IsNumber } from "class-validator";

export class AnalyticsAlarmRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly startedAt: string;

  @IsNotEmpty()
  @IsNumber()
  readonly analysisType: number;
}
