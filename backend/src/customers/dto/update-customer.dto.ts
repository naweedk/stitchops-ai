/**
 * Update Customer DTO — backend/src/customers/dto/update-customer.dto.ts
 *
 * Inherits all fields from CreateCustomerDto with all fields optional for PATCH updates.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
