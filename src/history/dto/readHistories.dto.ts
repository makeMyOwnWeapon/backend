import { IsString, IsInt } from 'class-validator';

export class ReadHistoriesDTO {
  @IsInt()
  subLectureId: number;
  @IsString()
  subLectureTitle: string;
  @IsString()
  lecturerName: string;
  @IsString()
  registrationDate: Date;
}
