import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '../entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [MemberService],
})
export class MemberModule {}
