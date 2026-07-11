import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class FingerprintService {
  /**
   * Creates a deterministic SHA-256 fingerprint for a verification request.
   * Used for duplicate detection via Redis.
   */
  generate(data: {
    cardTypeId: string;
    currency: string;
    amount: string;
    cardCode: string;
  }): string {
    const payload = `${data.cardTypeId}|${data.currency}|${data.amount}|${data.cardCode.trim().toUpperCase()}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Creates a request fingerprint from IP + user agent (for bot detection).
   */
  generateRequestFingerprint(ip: string, userAgent: string): string {
    const payload = `${ip}|${userAgent}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}
