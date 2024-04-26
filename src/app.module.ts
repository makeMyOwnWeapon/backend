import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { typeORMConfig } from './configs/typeorm.config';
import { DataSource } from 'typeorm';
import { LectureModule } from './lecture/lecture.module';
import { HistoryModule } from './history/history.module';
import { MemberModule } from './member/member.module';
//import { ConfigModule } from '@nestjs/config';
// import { envConfig } from './configs/env.config';

@Module({
  imports: [
    // ConfigModule.forRoot(envConfig),
    TypeOrmCoreModule.forRoot(typeORMConfig),
    LectureModule,
    HistoryModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
