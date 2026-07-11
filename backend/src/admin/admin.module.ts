import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AnalyticsModule } from '../analytics/analytics.module';
import { VerificationModule } from '../verification/verification.module';
import { SettingsModule } from '../settings/settings.module';
import { CardTypesModule } from '../card-types/card-types.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    AnalyticsModule,
    VerificationModule,
    SettingsModule,
    CardTypesModule,
    QueueModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
