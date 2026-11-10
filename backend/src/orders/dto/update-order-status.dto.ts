/**
 * Update Order Status DTO — backend/src/orders/dto/update-order-status.dto.ts
 *
 * Used to progress an order through garment manufacturing workflow stages.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({
    description: 'Current production stage status',
    enum: OrderStatus,
    example: OrderStatus.CUTTING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PARTIAL,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  readonly paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Quality check notes or stage update comments',
    example: 'Cutting completed. Batch moved to stitching floor line 3.',
  })
  @IsOptional()
  @IsString()
  readonly notes?: string;
}
