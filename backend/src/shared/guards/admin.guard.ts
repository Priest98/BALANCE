import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminKey = this.configService.get<string>('ADMIN_SECRET_KEY');

    if (!adminKey) {
      throw new UnauthorizedException('Admin access not configured');
    }

    const providedKey = request.headers['x-admin-key'];

    if (!providedKey || providedKey !== adminKey) {
      throw new UnauthorizedException('Invalid or missing admin key');
    }

    return true;
  }
}
