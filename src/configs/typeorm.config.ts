import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';

const snakeNamingStrategy = new SnakeNamingStrategy();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  autoLoadEntities: true,
  synchronize: false,
  namingStrategy: snakeNamingStrategy,
  logging: true,
};

// TODO: DB Config로 빼내기
export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    ...typeORMConfig,
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_DB'),
  };
};
