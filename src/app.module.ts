import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { getTypeOrmConfig } from './configs/typeorm.config';
import { DataSource } from 'typeorm';
import { LectureModule } from './lecture/lecture.module';
import { HistoryModule } from './history/history.module';
import { MemberModule } from './member/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    TypeOrmCoreModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        await getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    LectureModule,
    HistoryModule,
    MemberModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
