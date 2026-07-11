import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { FingerprintService } from './services/fingerprint.service';
import { AuditLogService } from './services/audit-log.service';
import { GeoService } from './services/geo.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  providers: [EncryptionService, FingerprintService, AuditLogService, GeoService, NotificationService],
  exports: [EncryptionService, FingerprintService, AuditLogService, GeoService, NotificationService],
})
export class SharedModule {}
