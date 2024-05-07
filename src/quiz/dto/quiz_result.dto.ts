import { IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizResultDTO {
  @ApiProperty({ description: '맞았는지 틀렸는지' })
  @IsBoolean()
  isCorrect: boolean;
  @ApiProperty({ description: '푸는데 걸린 시간' })
  @IsInt()
  solvedDuration: number;
  @ApiProperty({ description: 'quizId' })
  @IsInt()
  quizId: number;
  @ApiProperty({ description: 'choiceId' })
  @IsInt()
  choiceId: number;
  @ApiProperty({ description: 'lectureHistoriesId' })
  @IsInt()
  lectureHistoriesId: number;
}
