import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { GeoService } from '../shared/services/geo.service';

@ApiTags('verification')
@UseGuards(ThrottlerGuard)
@Controller()
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly geoService: GeoService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Submit a gift card verification request' })
  @ApiResponse({ status: 202, description: 'Verification job queued' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async verify(@Body() dto: CreateVerificationDto, @Req() req: Request) {
    const ip = this.geoService.getIpFromRequest(req.headers as Record<string, string>, req.ip || '');
    const country = this.geoService.getCountryFromHeaders(req.headers as Record<string, string>);
    const userAgent = (req.headers['user-agent'] as string) || '';

    return this.verificationService.createRequest(dto, { ip, userAgent, country: country || undefined });
  }

  @Get('verification/:id')
  @ApiOperation({ summary: 'Get verification result by request ID' })
  @ApiResponse({ status: 200, description: 'Verification result' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  getResult(@Param('id') id: string) {
    return this.verificationService.getResult(id);
  }
}
