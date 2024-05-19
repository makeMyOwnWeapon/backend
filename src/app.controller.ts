import { Controller, Get } from '@nestjs/common';
import * as process from 'process';
import { Public } from 'src/auth/auth.guard';
import LLMService from './llm/llm.service';

@Controller()
export class AppController {
  constructor(private llmService: LLMService) {}
  @Public()
  @Get('/env')
  getEnv(): string {
    return process.env.NODE_ENV;
  }

  @Public()
  @Get('/gpt-test')
  gptTest() {
    return this.llmService.chatGPT();
  }
}
