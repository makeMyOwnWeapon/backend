import {
  IsBoolean,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChoiceDTO {
  @ApiProperty({ description: '선택지 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '이 선택지가 답인지 아닌지' })
  @IsBoolean()
  isAnswer: boolean;
}

export class QuizDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간' })
  @IsString()
  popupTime: string; // 초 단위 정수(hh:mm:ss)

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => ChoiceDTO)
  choices: ChoiceDTO[];
}

export class NoTimeConvertingQuizDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간' })
  @IsString()
  popupTime: number; // 초 단위 정수(hh:mm:ss)

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => ChoiceDTO)
  choices: ChoiceDTO[];
}

export class CreateQuizSetDTO {
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
  @Type(() => QuizDTO)
  quizzes: QuizDTO[];
}

export class SummaryTextDTO{

  @ApiProperty({ description: '문제풀이 분석' })
  @IsString()
  reviews: string;

}

export class CreateQuestionSummeryDTO{

  @ApiProperty({ description : '문제풀이 분석 배열'})
  @IsArray()
  @ValidateNested({ each: true})
  @Type(() => SummaryTextDTO)
  Summary: SummaryTextDTO;

}


export class AppQuestionDTO {
  @ApiProperty({ description: '선택지 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '이 선택지가 답인지 아닌지' })
  @IsBoolean()
  isAnswer: boolean;
}

export class CreateAppQuestionDTO {
  @ApiProperty({ description: '문제 설명' })
  @IsString()
  instruction: string;

  @ApiProperty({ description: '문제 해설' })
  @IsString()
  commentary: string;

  @ApiProperty({ description: '문제 팝업시간' })
  @IsString()
  popupTime: string; // 초 단위 정수(hh:mm:ss)

  @ApiProperty({ description: '선택지' })
  @ValidateNested()
  @Type(() => AppQuestionDTO)
  choices: AppQuestionDTO[];
}




/*
@Type은 class-transformer 패키지에서 제공하는 데코레이터입니다. 
이 데코레이터는 클래스의 특정 속성이 어떤 클래스의 인스턴스임을 명시적으로 지정할 때 사용됩니다.

주로 DTO에서 하위 객체의 유효성 검사나 변환을 위해 사용됩니다.
예를 들어, DTO 내부에 다른 DTO나 엔티티가 포함되어 있을 때,
 해당 객체가 올바른 클래스의 인스턴스인지 확인하거나, 데이터를 해당 객체로 변환해야 할 때 사용됩니다.

@Type 데코레이터를 사용하면 해당 속성이 특정 클래스의 인스턴스임을 명시할 수 있으므로, 
class-validator가 해당 클래스의 유효성 검사를 수행하거나 class-transformer가 해당 클래스의 객체로 변환할 수 있습니다.

위의 예시에서 @Type(() => QuizDTO)는 quizzes 속성이 QuizDTO 클래스의 인스턴스의 배열임을 명시하고 있습니다. 
이는 해당 배열의 각 요소가 QuizDTO 클래스의 인스턴스여야 함을 의미합니다. 
이렇게 함으로써 class-validator와 class-transformer가 quizzes 배열 내의 각 요소에 대해 QuizDTO의 유효성 검사 및 변환을 수행할 수 있습니다.
*/
