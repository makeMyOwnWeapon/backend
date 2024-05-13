import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateQuizWithChoicesRequestDTO } from './quiz.dto';

export class QuizSetWithSubLectureResponseDTO {
  @IsInt()
  quizSetId: number;
  @IsString()
  quizSetTitle: string;
  @IsString()
  subLectureTitle: string;
  @IsString()
  subLectureUrl: string;
  @IsString()
  memberNickname: string;
  @IsString()
  createdAt: Date;
  @IsInt()
  recommendationCount: number;
}

export class CreateQuizSetRequestDTO {
  @ApiProperty({ description: '문제집 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '소강의URL' })
  @IsString()
  subLectureUrl: string;

  @ApiProperty({ description: '소강의 제목' })
  @IsString()
  subLectureTitle: string;

  @ApiProperty({ description: '대강의 제목' })
  @IsString()
  mainLectureTitle: string;

  @ApiProperty({ description: '영상 길이' })
  @IsInt()
  duration: number;

  @ApiProperty({ description: '문제 정보' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizWithChoicesRequestDTO)
  quizzes: CreateQuizWithChoicesRequestDTO[];
}

export class OnlyQuizSetResponseDTO {
  @IsInt()
  quizSetId: number;
  @IsString()
  quizSetTitle: string;
  @IsString()
  quizSetAuthor: string;
  @IsInt()
  recommendationCount: number;
  @IsString()
  createdAt: Date;
}
