import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import { requireUser, validateOrigin } from './auth'
import { HttpError } from './contract'
import { routeSchemas } from './generated/schemas'
import type { components } from './generated/api'

type Order = components['schemas']['Order']
type CreateOrder = components['schemas']['CreateOrder']
type User = components['schemas']['User']
type Header = {
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

async function hydrate(db: Knex, headers: Header[]): Promise<Order[]> {
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

export function registerOrders(app: FastifyInstance, db: Knex) {
  app.register(async (api) => {
    const users = new WeakMap<FastifyRequest, User>()
    api.addHook('onRequest', async (request, reply) => {
      reply.header('cache-control', 'no-store')
      validateOrigin(request)
      users.set(request, await requireUser(db, request))
    })
    api.post<{ Body: CreateOrder }>(
      '/api/orders',
      { schema: routeSchemas.createOrder },
      async (request, reply) => {
        const user = users.get(request)!
        const { items, receiving } = request.body
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
              user_id: user.id,
              status: 'paid',
              method: receiving.method,
              recipient_name: receiving.name.trim(),
              phone: receiving.phone.trim(),
              address: receiving.method === 'delivery' ? receiving.address.trim() : null,
              total_kopecks: total,
            })
            .returning('*')
          await tx('order_items').insert(
            snapshots.map((item) => ({ ...item, order_id: header.id })),
          )
          return (await hydrate(tx, [header]))[0]
        })
        return reply.code(201).send(order)
      },
    )
    api.get('/api/orders', { schema: routeSchemas.listOrders }, async (request) => {
      const headers: Header[] = await db('orders')
        .where('user_id', users.get(request)!.id)
        .orderBy('id', 'desc')
      return hydrate(db, headers)
    })
    api.get<{ Params: { id: number } }>(
      '/api/orders/:id',
      { schema: routeSchemas.getOrder },
      async (request) => {
        const header: Header | undefined = await db('orders')
          .where({ id: request.params.id, user_id: users.get(request)!.id })
          .first()
        if (!header) throw new HttpError(404, 'Заказ не найден')
        return (await hydrate(db, [header]))[0]
      },
    )
  })
}
