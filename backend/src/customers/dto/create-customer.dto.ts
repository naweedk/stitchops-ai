/**
 * Create Customer DTO — backend/src/customers/dto/create-customer.dto.ts
 *
 * Enforces validation and documents the request contract for adding a customer.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Company or Brand Name of the garment customer',
    example: 'Apex Apparel & Co.',
  })
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  readonly name!: string;

  @ApiPropertyOptional({
    description: 'Primary contact person name',
    example: 'Rajesh Sharma',
  })
  @IsOptional()
  @IsString()
  readonly contactPerson?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'orders@apexapparel.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'Phone / Mobile contact number',
    example: '+91 98765 43210',
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional({
    description: 'Billing / Shipping address',
    example: 'Plot 42, Okhla Industrial Area Phase III',
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiPropertyOptional({
    description: 'City / Manufacturing hub',
    example: 'New Delhi',
  })
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiPropertyOptional({
    description: 'GSTIN or Business Tax Identification number',
    example: '07AAAAA0000A1Z5',
  })
  @IsOptional()
  @IsString()
  readonly taxId?: string;

  @ApiPropertyOptional({
    description: 'Internal notes or special handling instructions',
    example: 'Requires double-layer carton packaging',
  })
  @IsOptional()
  @IsString()
  readonly notes?: string;
}
