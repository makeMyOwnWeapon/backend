import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { AnalyticsResultResponseDto } from './dto/AnalyticsResultResponse.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VideoAnalyticsHistoryEntity)
    private videoAnalyticsHistoryRepository: Repository<VideoAnalyticsHistoryEntity>,
  ) {}

  async saveVideoAnalyticsHistory(
    entity: VideoAnalyticsHistoryEntity,
  ): Promise<VideoAnalyticsHistoryEntity> {
    return this.videoAnalyticsHistoryRepository.save(entity);
  }

  async processImage(
    file: Express.Multer.File,
  ): Promise<AnalyticsResultResponseDto> {
    return this.executePyFile(file.buffer.toString('base64'));
  }

  executePyFile(base64ImageData: string): Promise<AnalyticsResultResponseDto> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3.11', [
        './image_processing_server/mediapipe_analysis.py',
      ]);
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

