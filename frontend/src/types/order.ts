/**
 * Order Types — src/types/order.ts
 */

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CUTTING'
  | 'STITCHING'
  | 'FINISHING'
  | 'QUALITY_CHECK'
  | 'READY_FOR_DISPATCH'
  | 'DELIVERED'
  | 'CANCELLED'

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID'

export interface OrderItem {
  id: string
  orderId: string
  styleName: string
  sku?: string | null
  color: string
  size: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: {
    id: string
    name: string
    contactPerson?: string | null
  }
  status: OrderStatus
  priority: Priority
  paymentStatus: PaymentStatus
  currency?: string
  totalQuantity: number
  totalAmount: number
  targetDeliveryDate?: string | null
  notes?: string | null
  items?: OrderItem[]
  _count?: {
    items: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateOrderItemInput {
  styleName: string
  sku?: string
  color: string
  size: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  customerId: string
  priority?: Priority
  currency?: string
  targetDeliveryDate?: string
  notes?: string
  items: CreateOrderItemInput[]
}
