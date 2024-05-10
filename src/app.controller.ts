import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as process from 'process';
import { Public } from 'src/auth/auth.guard';
import { exec } from 'child_process';

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
    return { message: 'upload success', result: result };
  }

  executePyFile(base64ImageData: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `python3 ./mediapipe.py ${base64ImageData}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return reject(error);
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(stdout);
        },
      );
    });
  }
}
