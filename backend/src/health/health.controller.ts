/**
 * Health Controller — backend/src/health/health.controller.ts
 *
 * Exposes GET /api/health for system status verification, container probes,
 * and frontend connectivity checks.
 */

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API service health status' })
  @ApiResponse({
    status: 200,
    description: 'Service is operational',
    type: HealthResponseDto,
  })
  check(): HealthResponseDto {
    return this.healthService.check();
  }
}
