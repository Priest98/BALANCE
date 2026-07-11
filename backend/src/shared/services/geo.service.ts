import { Injectable } from '@nestjs/common';

@Injectable()
export class GeoService {
  /**
   * Extracts country from request headers.
   * In production, you'd use a GeoIP library (e.g., maxmind).
   * For now we read the CF-IPCountry or X-Country header from CDN/reverse proxy.
   */
  getCountryFromHeaders(headers: Record<string, string | string[] | undefined>): string | null {
    const cfCountry = headers['cf-ipcountry'];
    const xCountry = headers['x-country'];
    const val = cfCountry || xCountry;
    if (!val || val === 'XX') return null;
    return Array.isArray(val) ? val[0] : val;
  }

  getIpFromRequest(headers: Record<string, string | string[] | undefined>, remoteIp: string): string {
    const forwardedFor = headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor;
      return ips.split(',')[0].trim();
    }
    return remoteIp;
  }
}
