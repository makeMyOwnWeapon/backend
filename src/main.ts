import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'prod'
      ? '.env.prod'
      : process.env.NODE_ENV === 'dev'
        ? '.env.dev'
        : '.env.local',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const sqlLogger = new Logger('SQL');
  app.useLogger(sqlLogger);

  await app.listen(3000);
}
bootstrap();
