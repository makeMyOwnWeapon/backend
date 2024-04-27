import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [MemberModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
