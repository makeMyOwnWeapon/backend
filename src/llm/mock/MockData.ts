export const MOCK = {
  LLMCreateQuizResponse: {
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
          "instruction": "다음 중 데이터 소스와 JPA 설정에 관한 내용이 맞는 선택지를 고르시오.",
          "commentary": "지문에서 데이터 소스와 JPA 설정을 하는 과정이 나와 있습니다. H2 데이터베이스를 사용하고, 메모리에서 데이터를 저장하며, JPA 설정을 했다는 내용이 있습니다.", 
          "choices": [
            {"content": "H2 콘솔을 활성화하고 데이터 소스 설정, JPA 기본 설정을 했다.", "isAnswer": true},
            {"content": "MariaDB를 사용하고 파일시스템에서 데이터를 저장했다.", "isAnswer": false}, 
            {"content": "Oracle을 사용하고 네트워크상에서 데이터를 공유했다.", "isAnswer": false},
            {"content": "MongoDB를 사용하고 클라우드에 데이터를 저장했다.","isAnswer": false}
          ]
        }`,
      },
    ],
    stop_reason: 'end_turn',
  },
  LLMSummaryResponse: {
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
          "summary": [
            {
                "keyword": "개념 이해",
                "comment": "학생들이 어려워하는 문제의 개념을 명확히 이해해야 합니다. 문제의 기본 개념을 반복해서 학습하고, 다양한 예제를 통해 개념을 확실히 다지는 것이 중요합니다."
            },
            {
                "keyword": "문제 풀이 전략",
                "comment": "문제를 해결하기 위한 다양한 전략을 익혀야 합니다. 시간 관리, 문제 접근 방법 등을 학습하여 문제를 효율적으로 해결할 수 있는 능력을 기르는 것이 필요합니다."
            },
            {
                "keyword": "오답 분석",
                "comment": "틀린 문제에 대해 철저히 분석하고, 왜 틀렸는지를 이해하는 것이 중요합니다. 오답 노트를 작성하고, 반복해서 복습함으로써 같은 실수를 반복하지 않도록 해야 합니다."
            }
          ]
        }
      `,
      },
    ],
    stop_reason: 'end_turn',
  },
};
