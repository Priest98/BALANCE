/**
 * Standalone worker entry point for BullMQ processor.
 * Run with: node dist/worker.js
 * 
 * In Docker Compose, this runs as a separate container.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  Logger.log('🔧 BullMQ Worker started', 'Worker');

  // Keep the process alive (workers listen for jobs)
  app.enableShutdownHooks();
}

bootstrapWorker();
