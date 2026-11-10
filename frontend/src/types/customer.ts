/**
 * Customer Types — src/types/customer.ts
 */

export interface Customer {
  id: string
  name: string
  contactPerson?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  taxId?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    orders: number
  }
}

export interface CreateCustomerInput {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  taxId?: string
  notes?: string
}
