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

@Injectable()
export default class LLMService {
  private readonly anthropic: Anthropic;
  constructor(
    private configService: ConfigService,
    @InjectRepository(GptCommentEntity)
    private readonly gptCommentRepository: Repository<GptCommentEntity>,
    @InjectRepository(LectureHistoryEntity)
    private readonly lectureHistoryRepository: Repository<LectureHistoryEntity>,
  ) {
    const API_KEY: string = configService.get<string>('CLAUDE_API_KEY');
    const configuration = { apiKey: API_KEY };
    this.anthropic = new Anthropic(configuration);
  }

  async createMockResponse() {
    return {
      id: 'msg_01KcQGY5y16LKmJDPSz3bXgc',
      type: 'message',
      role: 'assistant',
      model: 'claude-instant-1.2',
      stop_sequence: null,
      usage: {
        input_tokens: 1854,
        output_tokens: 231,
      },
      content: [
        {
          type: 'text',
          text: `{
            "instruction": "(test) 다음 중 데이터 소스와 JPA 설정에 관한 내용이 맞는 선택지를 고르시오.",
            "commentary": "지문에서 데이터 소스와 JPA 설정을 하는 과정이 나와 있습니다. H2 데이터베이스를 사용하고, 메모리에서 데이터를 저장하며, JPA 설정을 했다는 내용이 있습니다.", 
            "choices": [
              {"content": "(test) H2 콘솔을 활성화하고 데이터 소스 설정, JPA 기본 설정을 했다.", "isAnswer": true},
              {"content": "(test) MariaDB를 사용하고 파일시스템에서 데이터를 저장했다.", "isAnswer": false}, 
              {"content": "(test) Oracle을 사용하고 네트워크상에서 데이터를 공유했다.", "isAnswer": false},
              {"content": "(test) MongoDB를 사용하고 클라우드에 데이터를 저장했다.","isAnswer": false}
            ]
          }`,
        },
      ],
      stop_reason: 'end_turn',
    };
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
        } else {
          throw err;
        }
      });
  }

  async getResponseContentJson(response: Promise<any>): Promise<any> {
    const dto: string = (await response).content[0].text;
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
      this.createClaudeCompletion(QUIZ_MAKER_TEMPLATE, script),
    );
  }

  async generateSummary(script: string): Promise<AISummaryDTO> {
    return this.getResponseContentJson(
      this.createClaudeCompletion(Question_Summary_MAKER_TEMPLATE, script),
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
