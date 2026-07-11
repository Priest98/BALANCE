import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { FingerprintService } from './services/fingerprint.service';
import { AuditLogService } from './services/audit-log.service';
import { GeoService } from './services/geo.service';

@Global()
@Module({
  providers: [EncryptionService, FingerprintService, AuditLogService, GeoService],
  exports: [EncryptionService, FingerprintService, AuditLogService, GeoService],
})
export class SharedModule {}
