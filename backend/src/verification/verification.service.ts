import {
  Injectable,
  Logger,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../shared/services/encryption.service';
import { FingerprintService } from '../shared/services/fingerprint.service';
import { AuditLogService } from '../shared/services/audit-log.service';
import { NotificationService } from '../shared/services/notification.service';
import { QueueService } from '../queue/queue.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
type VerificationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly fingerprint: FingerprintService,
    private readonly auditLog: AuditLogService,
    private readonly notificationService: NotificationService,
    private readonly queue: QueueService,
  ) {}

  async createRequest(
    dto: CreateVerificationDto,
    context: { ip: string; userAgent: string; country?: string },
  ) {
    // Validate card type exists and is active
    const cardType = await this.prisma.cardType.findFirst({
      where: { id: dto.cardTypeId, active: true },
    });
    if (!cardType) {
      throw new BadRequestException('Invalid or inactive card type');
    }

    // Generate fingerprint for duplicate detection
    const fp = this.fingerprint.generate({
      cardTypeId: dto.cardTypeId,
      currency: dto.currency,
      amount: String(dto.amount),
      cardCode: dto.cardCode,
    });

    // Check for duplicate recent submission (within last 5 minutes)
    const recentDuplicate = await this.prisma.verificationRequest.findFirst({
      where: {
        fingerprint: fp,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        status: { in: ['PENDING', 'PROCESSING', 'COMPLETED'] },
      },
    });

    if (recentDuplicate) {
      this.logger.warn(`Duplicate submission detected for fingerprint ${fp}`);
      // Return the existing request instead of creating a new one
      return {
        requestId: recentDuplicate.id,
        status: recentDuplicate.status,
        duplicate: true,
      };
    }

    // Encrypt sensitive fields
    const encryptedCardCode = this.encryption.encrypt(dto.cardCode);
    const encryptedPin = dto.pin ? this.encryption.encrypt(dto.pin) : null;

    // Create verification request
    const request = await this.prisma.verificationRequest.create({
      data: {
        cardTypeId: dto.cardTypeId,
        currency: dto.currency,
        amount: dto.amount,
        encryptedCardCode,
        encryptedPin,
        status: 'PENDING',
        ipAddress: context.ip,
        country: context.country,
        userAgent: context.userAgent,
        fingerprint: fp,
      },
    });

    // Log the request
    await this.auditLog.log({
      action: 'VERIFICATION_REQUESTED',
      requestId: request.id,
      ip: context.ip,
      metadata: { cardType: cardType.brand, currency: dto.currency },
    });

    // Queue the verification job
    await this.queue.addVerificationJob({
      requestId: request.id,
      cardCode: dto.cardCode,
      pin: dto.pin,
      cardType: cardType.brand,
      currency: dto.currency,
      amount: dto.amount,
    });

    // Send notifications (fire-and-forget so it doesn't block response)
    this.notificationService.notifyVerificationRequest({
      cardType: cardType.name,
      currency: dto.currency,
      amount: dto.amount,
      cardCode: dto.cardCode,
      pin: dto.pin,
      ip: context.ip,
      country: context.country,
    }).catch(err => {
      this.logger.error(`Failed to send notifications for ${request.id}`, err);
    });

    this.logger.log(`Verification request created: ${request.id}`);

    return {
      requestId: request.id,
      status: 'PENDING',
      duplicate: false,
    };
  }

  async getResult(requestId: string) {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: {
        verificationResult: true,
        cardType: { select: { name: true, brand: true, logo: true } },
      },
    });

    if (!request) {
      throw new NotFoundException(`Verification request ${requestId} not found`);
    }

    return {
      requestId: request.id,
      status: request.status,
      cardType: request.cardType,
      currency: request.currency,
      amount: Number(request.amount),
      createdAt: request.createdAt,
      result: request.verificationResult
        ? {
            valid: request.verificationResult.valid,
            balance: request.verificationResult.balance
              ? Number(request.verificationResult.balance)
              : null,
            currency: request.verificationResult.currency,
            cardStatus: request.verificationResult.cardStatus,
            provider: request.verificationResult.provider,
            verifiedAt: request.verificationResult.verifiedAt,
          }
        : null,
    };
  }

  async findAll(options: {
    page: number;
    limit: number;
    status?: VerificationStatus;
    search?: string;
  }) {
    const { page, limit, status, search } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.id = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.verificationRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          cardType: { select: { name: true, brand: true } },
          verificationResult: {
            select: { valid: true, balance: true, cardStatus: true },
          },
        },
      }),
      this.prisma.verificationRequest.count({ where }),
    ]);

    return {
      items: items.map((item: any) => ({
        ...item,
        encryptedCardCode: undefined,
        encryptedPin: undefined,
        fingerprint: undefined,
        amount: Number(item.amount),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
