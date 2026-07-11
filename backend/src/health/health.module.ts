import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [HealthController],
})
export class HealthModule {}
