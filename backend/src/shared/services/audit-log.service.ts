import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: {
    action: string;
    requestId?: string;
    ip?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action: data.action,
        requestId: data.requestId,
        ip: data.ip,
        metadata: data.metadata as any,
      },
    });
  }

  async findAll(options: { page: number; limit: number; action?: string }) {
    const { page, limit, action } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: action ? { action: { contains: action, mode: 'insensitive' } } : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { request: { select: { id: true, cardTypeId: true, status: true } } },
      }),
      this.prisma.auditLog.count({
        where: action ? { action: { contains: action, mode: 'insensitive' } } : undefined,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
