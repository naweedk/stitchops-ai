/**
 * Health Response DTO — backend/src/health/dto/health-response.dto.ts
 *
 * Data Transfer Object representing the payload returned by GET /api/health.
 *
 * Key Concepts:
 * - DTOs define the shape and contract of data moving across the network.
 * - @ApiProperty provides Swagger/OpenAPI documentation for client SDK generation.
 * - IsString() ensures strict runtime validation.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Current operational status of the service',
    example: 'ok',
  })
  @IsString()
  readonly status!: string;

  @ApiProperty({
    description: 'Service identifier name',
    example: 'stitchops-api',
  })
  @IsString()
  readonly service!: string;
}
