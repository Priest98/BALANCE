import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderService } from '../providers/provider.service';
import { AuditLogService } from '../shared/services/audit-log.service';
type VerificationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
import { VERIFICATION_QUEUE, VerificationJobData } from './queue.service';

@Processor(VERIFICATION_QUEUE, {
  concurrency: Number(process.env.QUEUE_CONCURRENCY) || 5,
})
export class VerificationProcessor extends WorkerHost {
  private readonly logger = new Logger(VerificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly auditLog: AuditLogService,
  ) {
    super();
  }

  async process(job: Job<VerificationJobData>): Promise<void> {
    const { requestId, cardCode, pin, cardType, currency, amount } = job.data;
    this.logger.log(`Processing job ${job.id} for request ${requestId}`);

    // Mark as processing
    await this.prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: 'PROCESSING' },
    });

    // Call provider
    const response = await this.providerService.verifyCard({
      cardCode,
      pin,
      cardType,
      currency,
      amount,
    });

    // Save result
    await this.prisma.verificationResult.create({
      data: {
        requestId,
        provider: response.provider,
        valid: response.valid,
        balance: response.balance ?? null,
        currency: response.currency ?? currency,
        cardStatus: response.cardStatus as any,
        rawResponse: response.rawResponse as any,
        verifiedAt: response.verifiedAt,
      },
    });

    // Mark as completed
    await this.prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    });

    await this.auditLog.log({
      action: 'VERIFICATION_COMPLETED',
      requestId,
      metadata: { valid: response.valid, cardStatus: response.cardStatus },
    });

    this.logger.log(`Job ${job.id} completed: valid=${response.valid}`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<VerificationJobData>, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);

    if (job.attemptsMade >= (job.opts.attempts || 3)) {
      await this.prisma.verificationRequest.update({
        where: { id: job.data.requestId },
        data: { status: 'FAILED' },
      });

      await this.auditLog.log({
        action: 'VERIFICATION_FAILED',
        requestId: job.data.requestId,
        metadata: { error: error.message, attempts: job.attemptsMade },
      });
    }
  }
}
