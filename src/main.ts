import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const sqlLogger = new Logger('SQL');
  app.useLogger(sqlLogger);

  const config = new DocumentBuilder()
    .setTitle('LOA-api')
    .setDescription('namanmu team : Learn On Air API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        description: 'Enter token',
        name: 'Authorization',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'bearer',
      },
      'Authorization', //이 부분과
    )
    .build();

  // config를 바탕으로 swagger document 생성
  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI에 대한 path를 연결함
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
