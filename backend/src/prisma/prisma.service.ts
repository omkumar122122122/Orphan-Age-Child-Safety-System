import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to database');

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development') {
      (this.$on as any)('query', (e: any) => {
        if (e.duration > 200) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }

  /**
   * Soft-delete helper — sets deletedAt instead of removing the record.
   */
  async softDelete(model: string, id: string): Promise<void> {
    await (this as any)[model].update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Clean up expired tokens — call from a scheduled job.
   */
  async cleanExpiredTokens(): Promise<{ refreshTokens: number; otpTokens: number }> {
    const now = new Date();

    const [refreshTokens, otpTokens] = await Promise.all([
      this.refreshToken.deleteMany({
        where: { OR: [{ expiresAt: { lt: now } }, { isRevoked: true }] },
      }),
      this.otpToken.deleteMany({
        where: { OR: [{ expiresAt: { lt: now } }, { isUsed: true }] },
      }),
    ]);

    return { refreshTokens: refreshTokens.count, otpTokens: otpTokens.count };
  }
}
