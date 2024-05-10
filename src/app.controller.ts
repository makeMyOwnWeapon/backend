import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as process from 'process';
import { Public } from 'src/auth/auth.guard';
import { spawn } from 'child_process';

export class AnalysisResultType {
  isBlank: boolean;
  isSleep: boolean;
}

@Controller()
export class AppController {
  @Public()
  @Get('/env')
  getEnv(): string {
    return process.env.NODE_ENV;
  }

  @Public()
  @Post('/video')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeVideo(@UploadedFile() file: Express.Multer.File) {
    console.log('client file: ', file);
    const result = await this.executePyFile(file.buffer.toString('base64'));
    return { result: result };
  }

  executePyFile(base64ImageData: string): Promise<AnalysisResultType> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['./mediapipe_analysis.py']);
      let dataString = '';
      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
      });
      pythonProcess.on('error', (error) => {
        reject(error);
      });
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}`));
        } else {
          resolve(JSON.parse(dataString));
        }
      });
      // 데이터 전송
      pythonProcess.stdin.write(base64ImageData);
      pythonProcess.stdin.end();
    });
  }
}
