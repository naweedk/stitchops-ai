/**
 * API Client — src/lib/api.ts
 *
 * Centralized HTTP request handler communicating with the NestJS backend.
 */

import type { Customer, CreateCustomerInput } from '@/types/customer'
import type { Order, CreateOrderInput, OrderStatus } from '@/types/order'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`
    try {
      const errorData = await response.json()
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ')
      } else if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch {
      // Use fallback status text if body is not JSON
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

// -----------------------------------------------------------------------------
// Customer API Methods
// -----------------------------------------------------------------------------
export const customerApi = {
  list: () => request<Customer[]>('/customers'),
  getById: (id: string) => request<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerInput) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<Customer>(`/customers/${id}`, {
      method: 'DELETE',
    }),
}

// -----------------------------------------------------------------------------
// Order API Methods
// -----------------------------------------------------------------------------
export const orderApi = {
  list: (status?: OrderStatus) =>
    request<Order[]>(status ? `/orders?status=${status}` : '/orders'),
  getById: (id: string) => request<Order>(`/orders/${id}`),
  create: (data: CreateOrderInput) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: OrderStatus, notes?: string) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  delete: (id: string) =>
    request<Order>(`/orders/${id}`, {
      method: 'DELETE',
    }),
}
