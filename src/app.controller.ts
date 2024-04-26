import { Controller, Get } from '@nestjs/common';
import * as process from 'process';

@Controller()
export class AppController {
  @Get('/env')
  getEnv(): string {
    return process.env.NODE_ENV;
  }
}
