import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ProvidersModule } from '../providers/providers.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TerminusModule, ProvidersModule, PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
