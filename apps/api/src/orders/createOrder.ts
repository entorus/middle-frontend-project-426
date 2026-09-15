import type { Knex } from 'knex'

import { HttpError } from '../contract'
import type { components } from '../generated/api'
import { hydrateOrders } from './repository'
import type { Header } from './repository'

type CreateOrder = components['schemas']['CreateOrder']

export async function createOrder(db: Knex, userId: number, input: CreateOrder) {
  const { items, receiving } = input
  const ids = items.map((item) => item.id)
  if (new Set(ids).size !== ids.length)
    throw new HttpError(400, 'Товар не должен повторяться в заказе')
  const order = await db.transaction(async (tx) => {
    // A shared lock prevents price/availability changes and deletion until the snapshot is saved.
    const products: {
      id: number
      name: string
      price_kopecks: number
      available: boolean
    }[] = await tx('products').whereIn('id', ids).orderBy('id').forShare()
    const byId = new Map(products.map((product) => [product.id, product]))
    const problems: components['schemas']['ProblemProduct'][] = []
    for (const id of ids) {
      const product = byId.get(id)
      if (!product) problems.push({ id, reason: 'not_found' })
      else if (!product.available) problems.push({ id, reason: 'unavailable' })
    }
    if (problems.length)
      throw new HttpError(409, 'Заказ не создан: некоторые товары недоступны', problems)
    const snapshots = items.map((item) => {
      const product = byId.get(item.id)!
      return {
        product_id: product.id,
        name: product.name,
        price_kopecks: product.price_kopecks,
        quantity: item.quantity,
      }
    })
    const total = snapshots.reduce((sum, item) => sum + item.price_kopecks * item.quantity, 0)
    if (!Number.isSafeInteger(total)) throw new HttpError(400, 'Слишком большая сумма заказа')
    const [header]: Header[] = await tx('orders')
      .insert({
        user_id: userId,
        status: 'paid',
        method: receiving.method,
        recipient_name: receiving.name.trim(),
        phone: receiving.phone.trim(),
        address: receiving.method === 'delivery' ? receiving.address.trim() : null,
        total_kopecks: total,
      })
      .returning('*')
    await tx('order_items').insert(snapshots.map((item) => ({ ...item, order_id: header.id })))
    return (await hydrateOrders(tx, [header]))[0]
  })
  return order
}
