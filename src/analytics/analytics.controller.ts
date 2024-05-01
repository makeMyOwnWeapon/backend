// @ts-ignore

import { Body, Controller, Get, Headers, HttpStatus, Post, Res } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import {AnalyticsOccurRequestDto} from "./dto/AnalyticsOccurRequest.dto"
import { MemberService } from "../member/member.service";
import { LectureService } from "../lecture/lecture.service";
import { AnalyticsService } from "../analytics/analytics.service";

import { Response } from "express";

@Controller('analytics')
export class AnalyticsController {
  constructor(private jwtService: JwtService,
              private memberService: MemberService,
              private lectureService: LectureService,
              private analyticsService: AnalyticsService
  ) {}
  private getMemberIdByJwt(jwt: string): string | null {
      const parsedJwt = jwt?.split(' ')[1]; // Bearer 토큰 추출
      if (!parsedJwt) {
        return null;
      }

      try {
        const payload = this.jwtService.decode(parsedJwt);
        const memberId = payload['id']; // 또는 payload.userId
      if (!memberId) {
        return null;
        }
        return memberId;
      } catch (error) {
        console.log(error);
        return null; // 오류 발생 시 null 반환
      }
    }

  @Get()
  async checkHealth(
    @Headers('Authorization') jwt: string,
  ): Promise<string> {

    // JWT로 회원 조회
    const memberId = this.getMemberIdByJwt(jwt);
    const memberEntity = await this.memberService.retrieveMemberEntity(memberId);

    return 'OK';
  }


  @Post("/occur")
  async handleAnalyticsOccur(
    @Headers('Authorization') jwt: string,
    @Body() analyticsOccurRequestDto:AnalyticsOccurRequestDto,
    @Res() res: Response
  ) {
    try {
      const memberId = this.getMemberIdByJwt(jwt);
      const memberEntity = await this.memberService.retrieveMemberEntity(memberId);
      const sub_lecture_entity = await this.lectureService.retrieveSubLectureEntity(Number(analyticsOccurRequestDto.sublectureId));
      const videoAnalyticsHistoryEntity = analyticsOccurRequestDto.toEntity(sub_lecture_entity, memberEntity);
      await this.analyticsService.saveVideoAnalyticsHistory(videoAnalyticsHistoryEntity);

      return res.status(HttpStatus.OK).json({
        message: '데이터가 성공적으로 처리되었습니다.',
        data: analyticsOccurRequestDto
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '데이터 처리 중 오류가 발생했습니다.'
      });

      return res;
    }
  }

  // @Get('extension')
  // async authForExtension(@Headers('Authorization') authHeader: string, @Res() res: Response): Promise<ExtensionAuthResponseDto | Response<void>> {
  //   if (!authHeader) {
  //     return res.status(HttpStatus.BAD_REQUEST).send();
  //   }
  //   const signinDto = await this.memberService.signin(authHeader);
  //   if (!signinDto) {
  //     return res.status(HttpStatus.NO_CONTENT).send();
  //   }
  //   const token = this.jwtService.sign(signinDto, {
  //     expiresIn: this.configService.get('EXTENSION_EXPIRES_IN'),
  //   });
  //   return res.send({ token });
  // }
}