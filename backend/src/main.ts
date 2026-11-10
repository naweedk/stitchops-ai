/**
 * Application Entry Point — backend/src/main.ts
 *
 * Bootstraps the NestJS HTTP application using NestFactory.
 *
 * Decisions:
 * - Global prefix: '/api' ensures all endpoints are grouped under /api (e.g. /api/health)
 * - Port: Reads PORT environment variable, defaults to 4000
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);

  logger.log(`🚀 StitchOps API is running on: http://localhost:${port}/api`);
}

bootstrap();
