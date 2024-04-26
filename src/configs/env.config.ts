import { ConfigModuleOptions } from '@nestjs/config';
import process from 'process';
export const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV}`,
};

