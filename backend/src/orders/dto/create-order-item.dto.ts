/**
 * Create Order Item DTO — backend/src/orders/dto/create-order-item.dto.ts
 *
 * Line item specifying style, size, color, quantity, and unit price.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Garment style name',
    example: 'Crew Neck Cotton T-Shirt',
  })
  @IsNotEmpty()
  @IsString()
  readonly styleName!: string;

  @ApiPropertyOptional({
    description: 'Stock keeping unit / internal pattern code',
    example: 'TSH-CREW-01',
  })
  @IsOptional()
  @IsString()
  readonly sku?: string;

  @ApiProperty({
    description: 'Garment color shade',
    example: 'Navy Blue',
  })
  @IsNotEmpty()
  @IsString()
  readonly color!: string;

  @ApiProperty({
    description: 'Size breakdown tag (e.g. XS, S, M, L, XL, XXL or 32, 34)',
    example: 'L',
  })
  @IsNotEmpty()
  @IsString()
  readonly size!: string;

  @ApiProperty({
    description: 'Quantity of pieces for this size and color',
    example: 150,
  })
  @IsInt()
  @IsPositive()
  readonly quantity!: number;

  @ApiProperty({
    description: 'Unit selling price per garment piece',
    example: 12.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly unitPrice!: number;
}
