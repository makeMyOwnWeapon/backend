import {
  IsBoolean,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChoiceDTO {
  @IsString()
  content: string;

  @IsBoolean()
  isAnswer: boolean;
}

export class QuizDTO {
  @IsString()
  instruction: string;

  @IsString()
  commentary: string;

  @IsString()
  popupTime: string; // 초 단위 정수

  @ValidateNested()
  @Type(() => ChoiceDTO)
  choices: ChoiceDTO[];
}

export class CreateQuizSetDTO {
  @IsString()
  title: string;

  @IsString()
  subLectureUrl: string;

  @IsString()
  subLectureTitle: string;

  @IsString()
  mainLectureTitle: string;

  @IsString()
  lecturerName: string;

  @IsInt()
  duration: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDTO)
  quizzes: QuizDTO[];
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
