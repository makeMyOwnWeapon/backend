import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GptCommentEntity } from '../entities/gpt-comment.entity';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AIQuizCreateResponseDTO } from 'src/quiz/dto/ai-quiz.dto';
import {
  QUIZ_MAKER_TEMPLATE,
  Question_Summary_MAKER_TEMPLATE,
} from './template';
import { QuizEntity } from 'src/entities/quiz.entity';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { AISummaryDTO } from './dto/AiComment.dto';
import { MOCK } from './mock/MockData';
import OpenAI from 'openai';

@Injectable()
export default class LLMService {
  private readonly anthropic: Anthropic;
  private readonly openai: OpenAI;
  constructor(
    private configService: ConfigService,
    @InjectRepository(GptCommentEntity)
    private readonly gptCommentRepository: Repository<GptCommentEntity>,
    @InjectRepository(LectureHistoryEntity)
    private readonly lectureHistoryRepository: Repository<LectureHistoryEntity>,
  ) {
    // Claude (개발)
    const CLAUDE_API_KEY: string = configService.get<string>('CLAUDE_API_KEY');
    const configuration = { apiKey: CLAUDE_API_KEY };
    this.anthropic = new Anthropic(configuration);
    // ChatGPT (운영)
    const CHAT_GPT_API_KEY: string =
      configService.get<string>('CHAT_GPT_API_KEY');
    this.openai = new OpenAI({ apiKey: CHAT_GPT_API_KEY });
  }

  async createMockResponse(category: string) {
    if (category === 'LLMCreateQuizResponse') {
      return MOCK.LLMCreateQuizResponse;
    } else if (category === 'LLMSummaryResponse') {
      return MOCK.LLMSummaryResponse;
    }
    return null;
  }

  async createLLMCompletionResponse(
    template: string,
    message: string,
  ): Promise<string> {
    let response = null;
    switch (process.env.NODE_ENV) {
      case 'dev':
        response = await this.createClaudeCompletion(template, message);
        return response.content[0].text;
      case 'prod':
        response = await this.createChatGptCompletion(template, message);
        return response.choices[0].message.content;
    }
  }

  async createClaudeCompletion(
    template: string,
    message: string,
  ): Promise<any> {
    return await this.anthropic.messages
      .create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.4,
        system: template,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: message,
              },
            ],
          },
        ],
      })
      .catch(async (err) => {
        if (err instanceof Anthropic.APIError) {
          console.log(err.status); // 400
          console.log(err.name); // BadRequestError
          console.log(err.headers); // {server: 'nginx', ...}
          if (template === QUIZ_MAKER_TEMPLATE) {
            return this.createMockResponse('LLMCreateQuizResponse');
          } else if (template === Question_Summary_MAKER_TEMPLATE) {
            return this.createMockResponse('LLMSummaryResponse');
          }
        } else {
          throw err;
        }
      });
  }

  async createChatGptCompletion(
    template: string,
    message: string,
  ): Promise<any> {
    return await this.openai.chat.completions
      .create({
        messages: [
          { role: 'system', content: template },
          { role: 'user', content: message },
        ],
        model: 'gpt-3.5-turbo-0125',
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.6,
        n: 1,
      })
      .catch(async (error) => {
        if (error instanceof OpenAI.APIError) {
          console.log(error.status);
          console.log(error.error);
          console.log(error.message);
          if (template === QUIZ_MAKER_TEMPLATE) {
            return this.createMockResponse('LLMCreateQuizResponse');
          } else if (template === Question_Summary_MAKER_TEMPLATE) {
            return this.createMockResponse('LLMSummaryResponse');
          }
        } else {
          throw error;
        }
      });
  }

  async getResponseContentJson(responseContent: Promise<string>): Promise<any> {
    const dto: string = await responseContent;
    const startIndex = dto.indexOf('{');
    const endIndex = dto.lastIndexOf('}') + 1;
    console.log(dto);
    if (startIndex === -1 || endIndex === 0) {
      throw new Error('Invalid JSON data');
    }
    const jsonString: string = dto.slice(startIndex, endIndex);
    return JSON.parse(jsonString);
  }

  async generateQuiz(script: string): Promise<AIQuizCreateResponseDTO> {
    return this.getResponseContentJson(
      this.createLLMCompletionResponse(QUIZ_MAKER_TEMPLATE, script),
    );
  }

  async generateSummary(script: string): Promise<AISummaryDTO> {
    return this.getResponseContentJson(
      this.createLLMCompletionResponse(Question_Summary_MAKER_TEMPLATE, script),
    );
  }

  async readGptComments(lectureHistoryId: number): Promise<AISummaryDTO> {
    const gptComments = await this.gptCommentRepository.find({
      where: { lectureHistory: { id: lectureHistoryId } },
    });

    const summary = gptComments.map((gptComment) => ({
      keyword: gptComment.gptKeyword,
      comment: gptComment.gptCommentary,
    }));

    return { summary };
  }

  async saveGptComments(
    lectureHistoryId: number,
    gptSummary: AISummaryDTO,
  ): Promise<void> {
    const lectureHistory = await this.lectureHistoryRepository.findOne({
      where: { id: lectureHistoryId },
    });
    if (!lectureHistory) {
      throw new Error('LectureHistory not found');
    }

    const gptComments = gptSummary.summary.map(({ keyword, comment }) => {
      const gptComment = new GptCommentEntity();
      gptComment.lectureHistory = lectureHistory;
      gptComment.gptKeyword = keyword;
      gptComment.gptCommentary = comment;
      return gptComment;
    });

    await this.gptCommentRepository.save(gptComments);
  }

  async convertQuizResultToString(quizzes: QuizEntity[]): Promise<string> {
    const quizStrings = quizzes.map((quiz) => {
      const answer = quiz.quizResults;
      const choicesString = quiz.choices
        .map((choice) => choice.content)
        .join(', ');
      return `문제 제목: ${quiz.instruction}\n문제 선택지: ${choicesString}\n문제 해설: ${quiz.commentary}\n정답 여부: ${answer}`;
    });

    // 각 퀴즈 문자열을 한 줄에 이어서 결합합니다.
    return quizStrings.join('\n\n');
  }
}
