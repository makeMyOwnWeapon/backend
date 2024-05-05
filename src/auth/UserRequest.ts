import { AuthorizationCode } from 'src/entities/member.entity';

export class User {
  id: number;
  authorizationCode: AuthorizationCode;
  nickname: string;
  iat: number;
  exp: number;
}

export interface UserRequest extends Request {
  user: User;
}
