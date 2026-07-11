import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService, VERIFICATION_QUEUE } from './queue.service';
import { VerificationProcessor } from './verification.processor';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: VERIFICATION_QUEUE }),
    ProvidersModule,
  ],
  providers: [QueueService, VerificationProcessor],
  exports: [QueueService],
})
export class QueueModule {}
