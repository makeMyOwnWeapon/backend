import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { Repository } from 'typeorm';
import { SubLectureEntity } from '../entities/sub-lecture.entity';
import { LectureImageUrlEntity } from '../entities/lecture-image-url.entity';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';
// import { LectureHistoryInitRequestDto } from './dto/LectureHistoryInitRequest.dto';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { LectureHistorySaveRequestDto } from './dto/LectureHistorySaveRequest.dto';
import { SubLectureIdRetrieveResponseDto } from './dto/SubLectureIdRetrieveResponse.dto';
import { SubLectureCreateRequestDto } from './dto/SubLectureCreateRequest.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(MainLectureEntity)
    private readonly mainLectureRepository: Repository<MainLectureEntity>,
    @InjectRepository(SubLectureEntity)
    private readonly subLectureRepository: Repository<SubLectureEntity>,
    @InjectRepository(LectureImageUrlEntity)
    private readonly lectureImageUrlRepository: Repository<LectureImageUrlEntity>,
    @InjectRepository(LectureHistoryEntity)
    private readonly lectureHistoryRepository: Repository<LectureHistoryEntity>,
  ) {}

  async retrieveSubLectureEntity(
    subLectureId: number,
  ): Promise<SubLectureEntity> {
    const mainLecture = await this.subLectureRepository.findOne({
      where: { id: subLectureId },
    });
    if (!mainLecture) {
      throw new Error('MainLecture not found');
    }
    return mainLecture;
  }

  async insertMainLectures(title: string): Promise<number> {
    // 주어진 title과 name으로 MainLectureEntity를 찾음.
    const existingMainLecture = await this.mainLectureRepository.findOne({
      where: { title },
    });

    // 이미 존재하는 MainLectureEntity가 있다면 해당 엔티티의 id를 반환.
    if (existingMainLecture) {
      return existingMainLecture.id;
    }

    // 존재하지 않는다면 새로운 MainLectureEntity를 생성하고 저장.
    const newMainLecture = this.mainLectureRepository.create({
      title,
    });
    await this.mainLectureRepository.save(newMainLecture);

    // 저장한 MainLectureEntity의 id를 반환.
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
      throw new Error('MainLecture not found');
    }
    // 주어진 url, title, duration, mainLectureId으로 SubLectureEntity를 찾음.
    const existingSubLecture = await this.subLectureRepository.findOne({
      where: { url, title, duration, mainLecture: { id: mainLectureId } },
    });

    // 이미 존재하는 SubLectureEntity가 있다면 해당 엔티티의 id를 반환.
    if (existingSubLecture) {
      return existingSubLecture.id;
    }

    // 존재하지 않는다면 새로운 SubLectureEntity를 생성하고 저장.
    const newSubLecture = this.subLectureRepository.create({
      url,
      title,
      duration,
      mainLecture,
    });
    await this.subLectureRepository.save(newSubLecture);

    // 저장한 SubLectureEntity의 id를 반환.
    return newSubLecture.id;
  }

  async initializeLectureHistory(
    member: Promise<MemberEntity>,
    subLectureId: number,
  ) {
    const lectureHistory = this.lectureHistoryRepository.create({
      subLecture: { id: subLectureId },
      member: await member,
    });
    lectureHistory.startedAt = new Date();
    return {
      lectureHistoryId: (
        await this.lectureHistoryRepository.save(lectureHistory)
      ).id,
    };
  }

  async finalizeLectureHistory(
    lectureHistoryId: number,
    dto: LectureHistorySaveRequestDto,
  ): Promise<LectureHistoryResponseDto> {
    const lectureHistory = await this.lectureHistoryRepository.findOne({
      where: { id: lectureHistoryId },
    });
    if (!lectureHistory) {
      throw new NotFoundException('수강기록이 존재하지 않음');
    }
    lectureHistory.endedAt = dto.endedAt;
    return {
      lectureHistoryId: (
        await this.lectureHistoryRepository.save(lectureHistory)
      ).id,
    };
  }

  async retrieveSubLectureId(
    url: string,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    return await this.subLectureRepository
      .createQueryBuilder('subLecture')
      .select('subLecture.id', 'subLectureId')
      .where('subLecture.url = :url', { url })
      .getRawOne();
  }

  async createSubLecture(
    mainLectureTitle: string,
    dto: SubLectureCreateRequestDto,
  ): Promise<SubLectureIdRetrieveResponseDto> {
    let mainLecture = await this.mainLectureRepository.findOne({
      where: { title: mainLectureTitle },
    });
    if (!mainLecture) {
      const newMainLecture = this.mainLectureRepository.create({
        title: mainLectureTitle,
      });
      mainLecture = await this.mainLectureRepository.save(newMainLecture);
    }

    const { url, title, duration } = dto;
    const decodedUrl = decodeURIComponent(url);
    const existingSubLecture = await this.subLectureRepository.findOne({
      where: { url: decodedUrl },
    });
    if (existingSubLecture) {
      return { subLectureId: existingSubLecture.id };
    }

    const newSubLecture = this.subLectureRepository.create({
      url: decodedUrl,
      title,
      duration,
      mainLecture,
    });
    await this.subLectureRepository.save(newSubLecture);
    return {
      subLectureId: newSubLecture.id,
    };
  }
}
