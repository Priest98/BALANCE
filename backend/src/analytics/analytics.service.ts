import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalRequests,
      pendingRequests,
      completedRequests,
      failedRequests,
      totalValid,
      recentRequests,
      requestsByDay,
    ] = await Promise.all([
      this.prisma.verificationRequest.count(),
      this.prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.verificationRequest.count({ where: { status: 'COMPLETED' } }),
      this.prisma.verificationRequest.count({ where: { status: 'FAILED' } }),
      this.prisma.verificationResult.count({ where: { valid: true } }),
      this.prisma.verificationRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          cardType: { select: { name: true, brand: true } },
          verificationResult: { select: { valid: true, cardStatus: true } },
        },
      }),
      this.getRequestsByDay(),
    ]);

    const validRate =
      completedRequests > 0 ? Math.round((totalValid / completedRequests) * 100) : 0;

    return {
      totals: {
        total: totalRequests,
        pending: pendingRequests,
        completed: completedRequests,
        failed: failedRequests,
        valid: totalValid,
        validRate,
      },
      recentRequests: recentRequests.map((r: any) => ({
        id: r.id,
        cardType: r.cardType,
        currency: r.currency,
        amount: Number(r.amount),
        status: r.status,
        createdAt: r.createdAt,
        result: r.verificationResult,
      })),
      requestsByDay,
    };
  }

  private async getRequestsByDay() {
    const days = 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const requests = await this.prisma.verificationRequest.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true },
    });

    const byDay: Record<string, { date: string; total: number; completed: number; failed: number }> = {};

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      byDay[key] = { date: key, total: 0, completed: 0, failed: 0 };
    }

    for (const r of requests) {
      const key = r.createdAt.toISOString().split('T')[0];
      if (byDay[key]) {
        byDay[key].total++;
        if (r.status === 'COMPLETED') byDay[key].completed++;
        if (r.status === 'FAILED') byDay[key].failed++;
      }
    }

    return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
  }
}
