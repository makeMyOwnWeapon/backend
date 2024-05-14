import { IsString, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdditionalKeywordsResponseDTO } from './additionalKeyword.dto';

export class SleepinessAndDistractionDTO {
  @IsString()
  sleepinessStart: Date;
  @IsString()
  sleepinessEnd: Date;
  @IsString()
  distractionStart: Date;
  @IsString()
  distractionEnd: Date;
}

export class ChoiceDTO {
  @IsString()
  content: string;
  @IsBoolean()
  isAnswer: boolean;
}

export class QuizResultResponseDTO {
  @IsString()
  question: string;
  choices: ChoiceDTO[];
  @IsBoolean()
  isCorrect: boolean;
  @IsString()
  commentary: string;
  @IsString()
  userChoice: string;
  @IsInt()
  solvedDuration: number; // 추가된 항목: 퀴즈를 푸는 데 걸린 시간
}

export class ReadHistoryReportDTO {
  @ApiProperty({ description: '졸음/자리이탈 분석시간' })
  sleepinessAndDistraction: SleepinessAndDistractionDTO[];
  @ApiProperty({ description: '문제 정보' })
  quizzes: QuizResultResponseDTO[];
  @ApiProperty({ description: '분석 시작 시각', default: 0 })
  @IsString()
  studyStartTime: Date;
  @ApiProperty({ description: '분석 종료 시각', default: 0 })
  @IsString()
  studyEndTime: Date;
}

export class ReadHistoryReportExtentionDTO {
  @ApiProperty({ description: 'extention으로 보낼 레포트용 history' })
  reports: ReadHistoryReportDTO[];
  // TODO: 오타 수정!
  @ApiProperty({ description: 'gpt가 생성한 summery' })
  gptSummery: AdditionalKeywordsResponseDTO[];
}
