import { Module } from '@nestjs/common';

// The LogsModule is intentionally minimal.
// The actual AuditLogService lives in SharedModule (which is global).
// This module exists as a placeholder for future log-specific endpoints.
@Module({})
export class LogsModule {}
