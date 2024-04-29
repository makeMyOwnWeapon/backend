import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '../entities/member.entity';
import { MemberController } from './member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
