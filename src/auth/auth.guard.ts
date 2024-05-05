import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

export const Public = () => SetMetadata('public', true);

@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 엔드포인트에 @Public() 데코레이터가 있는 경우 토큰 검증 생략
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1]; // Bearer 토큰 추출
    try {
      const decodedToken = this.jwtService.verify(token);
      if (decodedToken) {
        request.user = decodedToken; // 요청 객체에 사용자 정보 추가
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
