import { IsInt, IsString } from 'class-validator';

export class SigninDto {
  @IsInt()
  authorizationCode: number;

  @IsInt()
  id: number;

  @IsString()
  nickname: string;
}
