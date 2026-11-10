/**
 * Root Application Module — backend/src/app.module.ts
 *
 * In NestJS, modules are the organizational building blocks.
 * Every NestJS application has at least one root module (AppModule).
 *
 * Key Concepts:
 * - @Module() decorator attaches metadata that NestJS uses to organize the application graph.
 * - imports: list of imported modules that export providers required in this module.
 * - controllers: list of API controllers defined in this module.
 * - providers: list of services, repositories, factories, or helpers injected across this module.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Load and parse .env files globally across all backend modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
