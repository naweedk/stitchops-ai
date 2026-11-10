/**
 * Customers Service — backend/src/customers/customers.service.ts
 *
 * Implements business operations for managing garment buyer accounts.
 * Interacts directly with PrismaService.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" was not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    // Ensure customer exists before attempting update
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    // Ensure customer exists before deletion
    await this.findOne(id);

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
