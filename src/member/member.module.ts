import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '../entities/member.entity';
import { MemberController } from './member.controller';
import { JwtService } from '@nestjs/jwt';
//import { JwtModule } from '@nestjs/jwt';
//import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    //ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([MemberEntity]),
    // JwtModule.registerAsync({
    //   global: true,
    //   useFactory: async (config: ConfigService) => ({
    //     secret: await config.get<string>('JWT_SECRET'),
    //     signOptions: await { expiresIn: config.get<string>('expiresIn') },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [MemberService, JwtService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
