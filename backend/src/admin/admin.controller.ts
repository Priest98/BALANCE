import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AnalyticsService } from '../analytics/analytics.service';
import { VerificationService } from '../verification/verification.service';
import { AuditLogService } from '../shared/services/audit-log.service';
import { SettingsService } from '../settings/settings.service';
import { CardTypesService } from '../card-types/card-types.service';
import { QueueService } from '../queue/queue.service';
type VerificationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
import { CreateCardTypeDto } from '../card-types/dto/create-card-type.dto';
import { UpdateCardTypeDto } from '../card-types/dto/update-card-type.dto';

@ApiTags('admin')
@ApiSecurity('admin-key')
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly verification: VerificationService,
    private readonly auditLog: AuditLogService,
    private readonly settings: SettingsService,
    private readonly cardTypes: CardTypesService,
    private readonly queue: QueueService,
  ) {}

  // ─── Dashboard ─────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboard() {
    return this.analytics.getDashboardStats();
  }

  // ─── Verifications ─────────────────────────────────────────────────────────

  @Get('verifications')
  @ApiOperation({ summary: 'List verification requests (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  getVerifications(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: VerificationStatus,
    @Query('search') search?: string,
  ) {
    return this.verification.findAll({ page: +page, limit: +limit, status, search });
  }

  // ─── Card Types ────────────────────────────────────────────────────────────

  @Get('card-types')
  @ApiOperation({ summary: 'List all card types (including inactive)' })
  getAllCardTypes() {
    return this.cardTypes.findAll({ activeOnly: false });
  }

  @Post('card-types')
  @ApiOperation({ summary: 'Create a card type' })
  createCardType(@Body() dto: CreateCardTypeDto) {
    return this.cardTypes.create(dto);
  }

  @Patch('card-types/:id')
  @ApiOperation({ summary: 'Update a card type' })
  updateCardType(@Param('id') id: string, @Body() dto: UpdateCardTypeDto) {
    return this.cardTypes.update(id, dto);
  }

  @Delete('card-types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a card type' })
  deleteCardType(@Param('id') id: string) {
    return this.cardTypes.remove(id);
  }

  // ─── Logs ──────────────────────────────────────────────────────────────────

  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, type: String })
  getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('action') action?: string,
  ) {
    return this.auditLog.findAll({ page: +page, limit: +limit, action });
  }

  // ─── Settings ──────────────────────────────────────────────────────────────

  @Get('settings')
  @ApiOperation({ summary: 'Get all settings' })
  getSettings() {
    return this.settings.findAll();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update settings (bulk)' })
  updateSettings(@Body() body: { settings: { key: string; value: string }[] }) {
    return this.settings.setBulk(body.settings);
  }

  // ─── Queue ─────────────────────────────────────────────────────────────────

  @Get('queue')
  @ApiOperation({ summary: 'Get queue statistics' })
  async getQueueStats() {
    const [stats, jobs] = await Promise.all([
      this.queue.getQueueStats(),
      this.queue.getRecentJobs(10),
    ]);
    return { stats, jobs };
  }

  @Post('queue/retry-failed')
  @ApiOperation({ summary: 'Retry all failed jobs' })
  retryFailed() {
    return this.queue.retryFailedJobs();
  }

  @Post('queue/clean')
  @ApiOperation({ summary: 'Clean old completed/failed jobs' })
  cleanJobs() {
    return this.queue.cleanOldJobs();
  }
}
