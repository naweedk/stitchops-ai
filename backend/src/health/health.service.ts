/**
 * Health Service — backend/src/health/health.service.ts
 *
 * Encapsulates health-check status logic.
 * In a production architecture, controllers only receive and dispatch requests;
 * business logic resides exclusively in injectable services.
 */

import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  check(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'stitchops-api',
    };
  }
}
