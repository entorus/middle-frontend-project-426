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
  const itemsByOrder = new Map<number, Order['items']>()
  for (const item of items) {
    const orderItems = itemsByOrder.get(item.order_id) ?? []
    const price = Number(item.price_kopecks)
    orderItems.push({
      productId: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: money(price),
      total: money(price * item.quantity),
    })
    itemsByOrder.set(item.order_id, orderItems)
  }
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
    items: itemsByOrder.get(header.id) ?? [],
  }))
}
