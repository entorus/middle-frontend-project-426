import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import { requireUser } from './auth/session'
import { validateOrigin } from './auth/validateOrigin'
import { HttpError } from './contract'
import { routeSchemas } from './generated/schemas'
import type { components } from './generated/api'
import { createOrder } from './orders/createOrder'
import { hydrateOrders } from './orders/repository'
import type { Header } from './orders/repository'

type CreateOrder = components['schemas']['CreateOrder']
type User = components['schemas']['User']

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
        const order = await createOrder(db, user.id, request.body)
        return reply.code(201).send(order)
      },
    )
    api.get('/api/orders', { schema: routeSchemas.listOrders }, async (request) => {
      const headers: Header[] = await db('orders')
        .where('user_id', users.get(request)!.id)
        .orderBy('id', 'desc')
      return hydrateOrders(db, headers)
    })
    api.get<{ Params: { id: number } }>(
      '/api/orders/:id',
      { schema: routeSchemas.getOrder },
      async (request) => {
        const header: Header | undefined = await db('orders')
          .where({ id: request.params.id, user_id: users.get(request)!.id })
          .first()
        if (!header) throw new HttpError(404, 'Заказ не найден')
        return (await hydrateOrders(db, [header]))[0]
      },
    )
  })
}
