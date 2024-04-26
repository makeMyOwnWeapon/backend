import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainLectureEntity } from '../entities/main-lecture.entity';
import { Repository } from 'typeorm';
import { SubLectureEntity } from '../entities/sub-lecture.entity';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(MainLectureEntity)
    private readonly mainLectureRepository: Repository<MainLectureEntity>,
    @InjectRepository(SubLectureEntity)
    private readonly subLectureRepository: Repository<SubLectureEntity>,
  ) {}
}
