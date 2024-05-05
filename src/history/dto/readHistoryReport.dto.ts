import { IsString, IsInt, IsBoolean } from 'class-validator';

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

export class QuizDTO {
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
  sleepinessAndDistraction: SleepinessAndDistractionDTO[];
  quizzes: QuizDTO[];
  @IsString()
  studyStartTime: Date;
  @IsString()
  studyEndTime: Date;
}
