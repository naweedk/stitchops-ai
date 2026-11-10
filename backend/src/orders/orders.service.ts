/**
 * Orders Service — backend/src/orders/orders.service.ts
 *
 * Implements business logic for production orders:
 * - Sequential order number generation (ORD-YYYY-XXXX)
 * - Automatic calculation of order total quantity and total amount
 * - Transactional creation of orders with line items
 * - Production workflow stage transitions
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // 1. Verify customer existence
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${createOrderDto.customerId}" was not found`,
      );
    }

    // 2. Compute aggregate totals from line items
    const totalQuantity = createOrderDto.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // 3. Generate sequential order number (ORD-YYYY-XXXX)
    const currentYear = new Date().getFullYear();
    const count = await this.prisma.order.count();
    const orderNumber = `ORD-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    // 4. Atomic creation: Order and nested OrderItems in a single query
    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId: createOrderDto.customerId,
        priority: createOrderDto.priority,
        currency: createOrderDto.currency || 'USD',
        targetDeliveryDate: createOrderDto.targetDeliveryDate
          ? new Date(createOrderDto.targetDeliveryDate)
          : null,
        notes: createOrderDto.notes,
        totalQuantity,
        totalAmount,
        items: {
          create: createOrderDto.items.map((item) => ({
            styleName: item.styleName,
            sku: item.sku,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  async findAll(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" was not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    // Ensure order exists
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
        paymentStatus: updateOrderStatusDto.paymentStatus,
        notes: updateOrderStatusDto.notes,
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
