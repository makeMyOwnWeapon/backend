import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userInfoDto {
  @ApiProperty({ description: '학생인지 선생인지', default: 0 })
  @IsInt()
  authorizationCode: number;

  @ApiProperty({ description: '멤버id', default: 4 })
  @IsInt()
  id: number;

  @ApiProperty({ description: '닉네임', default: 'CoolWizard' })
  @IsString()
  nickname: string;
}

export class SignupDto {
  @ApiProperty({ description: '학생인지 선생인지', default: 0 })
  @IsInt()
  authorizationCode: number;

  @IsString()
  oauthId: string;

  @ApiProperty({ description: '닉네임', default: 'jee' })
  @IsString()
  nickname: string;
}

export class Signup2Dto {
  @ApiProperty({ description: '학생인지 선생인지', default: 0 })
  @IsInt()
  authorizationCode: number;

  @ApiProperty({ description: '닉네임', default: 'jee' })
  @IsString()
  nickname: string;
}
