import { Module } from '@nestjs/common';
import LLMService from './llm.service';

@Module({
  exports: [LLMService],
  providers: [LLMService],
})
export class LLMModule {}
