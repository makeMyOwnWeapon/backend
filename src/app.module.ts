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
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AnalyticsModule } from './analytics/analytics.module';
import { APP_GUARD } from '@nestjs/core';
import { MemberAuthGuard } from 'src/auth/auth.guard';
import { AppGateway } from './socket/socket';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: await config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: await config.get<string>('EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmCoreModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        await getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    LectureModule,
    HistoryModule,
    MemberModule,
    AuthModule,
    QuizModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MemberAuthGuard,
    },
    AppGateway,
  ],
  exports: [AppGateway],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
