/**
 * Prisma Module — backend/src/prisma/prisma.module.ts
 *
 * Global module providing PrismaService across the entire application.
 *
 * Key Concepts:
 * - @Global() decorator makes PrismaService available everywhere without needing
 *   every feature module (Customers, Orders, Workers, etc.) to re-import PrismaModule.
 * - exports: [PrismaService] enables dependency injection in any service.
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
