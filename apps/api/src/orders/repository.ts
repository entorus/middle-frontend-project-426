import type { Knex } from 'knex'

import type { components } from '../generated/api'

type Order = components['schemas']['Order']
export type Header = {
  id: number
  user_id: number
  status: 'paid'
  created_at: Date
  method: 'delivery' | 'pickup'
  recipient_name: string
  phone: string
  address: string | null
  total_kopecks: string
}
type Item = {
  order_id: number
  product_id: number
  name: string
  quantity: number
  price_kopecks: string
}
const money = (amount: number): components['schemas']['Money'] => ({ amount, currency: 'RUB' })

export async function hydrateOrders(db: Knex, headers: Header[]): Promise<Order[]> {
  if (!headers.length) return []
  const items: Item[] = await db('order_items')
    .whereIn(
      'order_id',
      headers.map((order) => order.id),
    )
    .orderBy('id')
  return headers.map((header) => ({
    id: header.id,
    status: header.status,
    createdAt: new Date(header.created_at).toISOString(),
    receiving:
      header.method === 'delivery'
        ? {
            method: 'delivery',
            name: header.recipient_name,
            phone: header.phone,
            address: header.address!,
          }
        : { method: 'pickup', name: header.recipient_name, phone: header.phone },
    total: money(Number(header.total_kopecks)),
    items: items
      .filter((item) => item.order_id === header.id)
      .map((item) => ({
        productId: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: money(Number(item.price_kopecks)),
        total: money(Number(item.price_kopecks) * item.quantity),
      })),
  }))
}
