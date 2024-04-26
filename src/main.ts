import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const sqlLogger = new Logger('SQL');
  app.useLogger(sqlLogger);

  await app.listen(3000);
}
bootstrap();
