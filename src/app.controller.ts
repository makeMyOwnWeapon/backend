import { Controller, Get } from '@nestjs/common';
import * as process from 'process';
import { Public } from 'src/auth/auth.guard';

@Controller()
export class AppController {
  @Public()
  @Get('/env')
  getEnv(): string {
    return process.env.NODE_ENV;
  }
}
