/**
 * Application Entry Point — backend/src/main.ts
 *
 * Bootstraps the NestJS HTTP application using NestFactory.
 *
 * Configured features:
 * 1. Global Prefix: '/api' ensures all endpoints reside under /api.
 * 2. Validation Pipe: Automatic request payload validation using class-validator.
 * 3. CORS: Configured for the Next.js frontend origin.
 * 4. Swagger / OpenAPI: Interactive API docs available at /api/docs.
 * 5. Structured Logging: NestJS Logger for server events.
 */

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Global API Prefix
  app.setGlobalPrefix('api');

  // 2. Global Request Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties not present in the DTO
      forbidNonWhitelisted: true, // Rejects requests with non-whitelisted properties
      transform: true, // Automatically converts incoming payloads to DTO class instances
      transformOptions: {
        enableImplicitConversion: true, // Coerces primitive types (e.g. query param string "123" to number 123)
      },
    }),
  );

  // 3. Cross-Origin Resource Sharing (CORS)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 4. OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('StitchOps AI API')
    .setDescription(
      'REST API documentation for StitchOps AI manufacturing management platform',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // 5. Port Binding and Initialization
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 StitchOps API running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
