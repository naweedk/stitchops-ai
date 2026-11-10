/**
 * Create Order DTO — backend/src/orders/dto/create-order.dto.ts
 *
 * Request payload for creating a production order with nested items.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique ID of the customer placing the order',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsString()
  readonly customerId!: string;

  @ApiPropertyOptional({
    description: 'Production priority level',
    enum: Priority,
    default: Priority.NORMAL,
  })
  @IsOptional()
  @IsEnum(Priority)
  readonly priority?: Priority;

  @ApiPropertyOptional({
    description: 'Order billing currency code (e.g. USD, INR, EUR, GBP)',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  readonly currency?: string;

  @ApiPropertyOptional({
    description: 'Target delivery / dispatch completion date (ISO 8601)',
    example: '2026-12-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly targetDeliveryDate?: string;

  @ApiPropertyOptional({
    description: 'Order instructions, fabric requirements, or packing notes',
    example: 'Fabric wash required before cutting',
  })
  @IsOptional()
  @IsString()
  readonly notes?: string;

  @ApiProperty({
    description: 'Array of garment items, sizes, and quantities in this order',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one line item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  readonly items!: CreateOrderItemDto[];
}
