import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { Repository } from 'typeorm';
import { SubLectureEntity } from '../entities/sub-lecture.entity';
import { LectureImageUrlEntity } from '../entities/lecture-image-url.entity';
import { LectureHistoryResponseDto } from './dto/LectureHistoryResponse.dto';
import { LectureHistoryInitRequestDto } from './dto/LectureHistoryInitRequest.dto';
import { LectureHistoryEntity } from '../entities/lecture-history.entity';

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

  async insertMainLectures(title: string, name: string): Promise<number> {
    // 주어진 title과 name으로 MainLectureEntity를 찾음.
    const existingMainLecture = await this.mainLectureRepository.findOne({
      where: { title, lecturer_name: name },
    });

    // 이미 존재하는 MainLectureEntity가 있다면 해당 엔티티의 id를 반환.
    if (existingMainLecture) {
      return existingMainLecture.id;
    }

    // 존재하지 않는다면 새로운 MainLectureEntity를 생성하고 저장.
    const newMainLecture = this.mainLectureRepository.create({
      title,
      lecturer_name: name,
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

  async initializeLectureHistory(dto: LectureHistoryInitRequestDto, memberId: number): Promise<LectureHistoryResponseDto> {
    // this.lectureHistoryEntity.create({
    //
    // })
    return undefined;
  }
}
