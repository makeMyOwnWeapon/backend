import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoAnalyticsHistoryEntity } from '../entities/video-analytics-history.entity';
import { Repository } from 'typeorm';

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
}
