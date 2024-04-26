import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const snakeNamingStrategy = new SnakeNamingStrategy();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test-namanmu',
  autoLoadEntities: true,
  synchronize: true,
  namingStrategy: snakeNamingStrategy,
  logging: true,
};
