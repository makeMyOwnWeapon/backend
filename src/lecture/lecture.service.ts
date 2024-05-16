import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { Repository } from 'typeorm';
import { SubLectureEntity } from '../entities/sub-lecture.entity';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { SubLectureIdRetrieveResponseDto } from './dto/SubLectureIdRetrieveResponse.dto';
import { SubLectureCreateRequestDto } from './dto/SubLectureCreateRequest.dto';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(MainLectureEntity)
    private readonly mainLectureRepository: Repository<MainLectureEntity>,
    @InjectRepository(SubLectureEntity)
    private readonly subLectureRepository: Repository<SubLectureEntity>,
    @InjectRepository(LectureHistoryEntity)
    private readonly lectureHistoryRepository: Repository<LectureHistoryEntity>,
  ) {}

  async retrieveSubLectureEntity(
    subLectureId: number,
  ): Promise<SubLectureEntity> {
    const subLecture = await this.subLectureRepository.findOne({
      where: { id: subLectureId },
    });
    if (!subLecture) {
      throw new NotFoundException('SubLecture not found');
    }
    return subLecture;
  }

  async insertMainLectures(title: string): Promise<number> {
    const existingMainLecture = await this.mainLectureRepository.findOne({
      where: { title },
    });

    if (existingMainLecture) {
      return existingMainLecture.id;
    }

    const newMainLecture = this.mainLectureRepository.create({ title });
    await this.mainLectureRepository.save(newMainLecture);
    return newMainLecture.id;
  }

  async insertSubLectures(
    url: string,
    title: string,
    duration: number,
    mainLectureId: number,
  ): Promise<number> {
    const mainLecture = await this.mainLectureRepository.findOne({
      where: { id: mainLectureId },
    });
    if (!mainLecture) {
      throw new NotFoundException('MainLecture not found');
    }

    const existingSubLecture = await this.subLectureRepository.findOne({
      where: { url, title, duration, mainLecture: { id: mainLectureId } },
    });

    if (existingSubLecture) {
      return existingSubLecture.id;
    }

    const newSubLecture = this.subLectureRepository.create({
      url,
      title,
      duration,
      mainLecture,
    });
    await this.subLectureRepository.save(newSubLecture);
    return newSubLecture.id;
  }

  async initializeLectureHistory(
    member: Promise<MemberEntity>,
    subLectureId: number,
    startTime: Date,
  ): Promise<LectureHistoryResponseDto> {
    const lectureHistory = this.lectureHistoryRepository.create({
      subLecture: { id: subLectureId },
      member: await member,
      startedAt: startTime,
    });

    const savedLectureHistory = await this.lectureHistoryRepository.save(lectureHistory);

    return { 
      lectureHistoryId: savedLectureHistory.id, 
      startedAt: savedLectureHistory.startedAt.toISOString(),
      endedAt: ''
    };
  }

  async finalizeLectureHistory(lectureHistoryId: number, endTime: Date): Promise<LectureHistoryResponseDto> {
    const lectureHistory = await this.lectureHistoryRepository.findOne({
      where: { id: lectureHistoryId },
    });
    if (!lectureHistory) {
      throw new NotFoundException('Lecture history not found');
    }

    lectureHistory.endedAt = endTime;
    const savedLectureHistory = await this.lectureHistoryRepository.save(lectureHistory);

    return {
      lectureHistoryId: savedLectureHistory.id,
      startedAt: savedLectureHistory.startedAt.toISOString(),
      endedAt: savedLectureHistory.endedAt.toISOString(),
    };
  }

  async retrieveSubLectureId(
    url: string,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    const subLecture = await this.subLectureRepository.findOne({
      where: { url },
      select: ['id', 'createdAt'],
    });

    if (!subLecture) {
      throw new NotFoundException('SubLecture not found');
    }

    return {
      subLectureId: subLecture.id,
      startedAt: subLecture.createdAt.toISOString(),
    };
  }

  async createSubLecture(
    mainLectureTitle: string,
    dto: SubLectureCreateRequestDto,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    let mainLecture = await this.mainLectureRepository.findOne({
      where: { title: mainLectureTitle },
    });

    if (!mainLecture) {
      const newMainLecture = this.mainLectureRepository.create({ title: mainLectureTitle });
      mainLecture = await this.mainLectureRepository.save(newMainLecture);
    }

    const { url, title, duration } = dto;
    const decodedUrl = decodeURIComponent(url);

    const existingSubLecture = await this.subLectureRepository.findOne({
      where: { url: decodedUrl },
    });

    if (existingSubLecture) {
      return {
        subLectureId: existingSubLecture.id,
        startedAt: existingSubLecture.createdAt.toISOString(),
      };
    }

    const newSubLecture = this.subLectureRepository.create({
      url: decodedUrl,
      title,
      duration,
      mainLecture,
    });

    const savedSubLecture = await this.subLectureRepository.save(newSubLecture);

    return {
      subLectureId: savedSubLecture.id,
      startedAt: savedSubLecture.createdAt.toISOString(),
    };
  }
}
