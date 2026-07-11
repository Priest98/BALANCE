import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const VERIFICATION_QUEUE = 'verification';

export interface VerificationJobData {
  requestId: string;
  cardCode: string;
  pin?: string;
  cardType: string;
  currency: string;
  amount: number;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(VERIFICATION_QUEUE)
    private readonly verificationQueue: Queue,
  ) {}

  async addVerificationJob(data: VerificationJobData) {
    const job = await this.verificationQueue.add('verify-card', data, {
      attempts: Number(process.env.JOB_ATTEMPTS) || 3,
      backoff: {
        type: 'exponential',
        delay: Number(process.env.JOB_BACKOFF_DELAY) || 5000,
      },
      removeOnComplete: { count: 1000, age: 30 * 24 * 3600 }, // keep 1000 or 30 days
      removeOnFail: { count: 500, age: 7 * 24 * 3600 },       // dead-letter: keep 500 or 7 days
    });

    this.logger.log(`Queued verification job ${job.id} for request ${data.requestId}`);
    return job;
  }

  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.verificationQueue.getWaitingCount(),
      this.verificationQueue.getActiveCount(),
      this.verificationQueue.getCompletedCount(),
      this.verificationQueue.getFailedCount(),
      this.verificationQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  async getRecentJobs(limit = 20) {
    const [active, completed, failed] = await Promise.all([
      this.verificationQueue.getActive(0, limit),
      this.verificationQueue.getCompleted(0, limit),
      this.verificationQueue.getFailed(0, limit),
    ]);
    return { active, completed, failed };
  }

  async retryFailedJobs() {
    const failed = await this.verificationQueue.getFailed();
    for (const job of failed) {
      await job.retry();
    }
    return { retried: failed.length };
  }

  async cleanOldJobs() {
    await Promise.all([
      this.verificationQueue.clean(30 * 24 * 3600 * 1000, 100, 'completed'),
      this.verificationQueue.clean(7 * 24 * 3600 * 1000, 100, 'failed'),
    ]);
    return { cleaned: true };
  }
}
