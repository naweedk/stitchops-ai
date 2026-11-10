/**
 * Prisma Service — backend/src/prisma/prisma.service.ts
 *
 * Central database client service wrapping PrismaClient.
 *
 * Key Concepts:
 * - Extends PrismaClient to inherit all auto-generated database query methods.
 * - Implements NestJS OnModuleInit and OnModuleDestroy for managed connection lifecycle.
 * - Safe initialization: attempts connection only if DATABASE_URL is configured,
 *   preventing initialization crashes when local database is not yet running.
 */

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

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL;

    // Connect only if a real connection URL is provided (not empty or template placeholder)
    if (dbUrl && !dbUrl.includes('user:password')) {
      try {
        await this.$connect();
        this.logger.log('Connected to PostgreSQL database via Prisma');
      } catch (err) {
        this.logger.warn(
          `PostgreSQL connection deferred: ${(err as Error).message}`,
        );
      }
    } else {
      this.logger.log(
        'Prisma client ready (DATABASE_URL pending configuration)',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database');
  }
}
