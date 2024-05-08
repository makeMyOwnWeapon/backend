import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AIQuizCreateResponseDTO } from 'src/quiz/dto/ai-quiz-create.dto';

@Injectable()
export default class LLMService {
  private readonly anthropic: Anthropic;
  constructor(private configService: ConfigService) {
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

  async createClaudeCompletion(lectureScript: string): Promise<any> {
    // TODO: 시스템 프롬프트를 파라미터에 따라 수정할 수 있는 형태로 변경.
    // return await this.anthropic.messages
    //   .create({
    //     model: 'claude-instant-1.2',
    //     max_tokens: 500,
    //     temperature: 0.5,
    //     system: `내가 주는 것은 강의 스크립트야. 이 스크립트 기반으로 너는 강의를 잘 들었는지 확인하는 문제를 만들어야해. 스크립트를 읽고 너가 인터넷 강사라고 생각하고 학생들에게 내용을 이해시켜야해. 문제는 객관식이고 100글자를 넘으면 안돼. 선택지는 4개가 있어야해. 정답에 대한 해설을 제공해야해. 정답인 선택지는 하나이고 나머지는 오답이여야해. 정답지는 isAnswer 값이 true이고, 오답은 isAnswer 값이 false여야해. 선택지는 스크립트에서 나온 내용과 자주 언급되는 내용으로 구성해야해. 각 선택지별로 정답 여부를 나타내는 boolean형태의 속성을 가져. 특정 내용이 어느 시점에 나왔는지를 묻는 문제는 출제하지마. 답변은 문자열로 나타난 json형식으로 해.
    //     다음은 너가 답변해야할 형식의 예시야.
    //     """
    //     {
    //     "instruction": "문제", "commentary": "해설",
    //     "choices": [{"content" : "선택지", "isAnswer": true}]
    //     }
    //     """`,
    //     messages: [
    //       {
    //         role: 'user',
    //         content: [
    //           {
    //             type: 'text',
    //             text: lectureScript,
    //           },
    //         ],
    //       },
    //     ],
    //   })
    //   .catch(async (err) => {
    //     if (err instanceof Anthropic.APIError) {
    //       console.log(err.status); // 400
    //       console.log(err.name); // BadRequestError
    //       console.log(err.headers); // {server: 'nginx', ...}
    //     } else {
    //       throw err;
    //     }
    //   });
    console.log(lectureScript);
    return this.createMockResponse();
  }

  async getResponseContentJson(response: Promise<any>): Promise<any> {
    const dto: string = (await response).content[0].text;
    return JSON.parse(dto);
  }

  async generateQuiz(script: string): Promise<AIQuizCreateResponseDTO> {
    return this.getResponseContentJson(this.createClaudeCompletion(script));
  }
}
