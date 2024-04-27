// quiz.controller.ts
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtService } from '@nestjs/jwt';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/registration')
  async createLecture(
    @Body() quizData: any,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    const userId = this.extractUserIdFromToken(authHeader);
    if (!userId) {
      return 'Invalid token';
    }

    const result = await this.quizService.createLecture(quizData, userId);
    return result;
  }

  private extractUserIdFromToken(authHeader: string): string | null {
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      return null;
    }
    const decodedToken: any = this.jwtService.decode(token);
    return decodedToken?.sub || null;
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
