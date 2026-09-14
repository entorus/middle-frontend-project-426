import { extname, resolve } from 'node:path'

import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import * as Sentry from '@sentry/node'

import { db } from './db'
import { registerAuth } from './auth'
import { configureContract } from './contract'
import { routeSchemas } from './generated/schemas'
import { registerCatalog } from './catalog'
import { registerPromotions } from './promotions'

const fastify = Fastify({
  logger: {
    redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
  },
})

configureContract(fastify)
registerAuth(fastify, db)
Sentry.setupFastifyErrorHandler(fastify)

fastify.get('/health-check', { schema: routeSchemas.healthCheck }, (request, reply) => {
  reply.send({ health: 'check' })
})

fastify.register(fastifyStatic, {
  root: resolve(__dirname, '../../front/dist'),
  prefix: '/',
})

fastify.setNotFoundHandler((request, reply) => {
  const pathname = request.url.split('?')[0]
  const isApi = pathname === '/api' || pathname.startsWith('/api/')
  const isPageRequest = request.method === 'GET' || request.method === 'HEAD'
  const isAsset = pathname.startsWith('/assets/') || Boolean(extname(pathname))

  if (isApi || !isPageRequest || isAsset) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Маршрут не найден',
    })
  }

  return reply.code(200).sendFile('index.html')
})

if (process.env.SENTRY_TEST_ENABLED === 'true') {
  fastify.get('/api/debug-sentry', () => {
    throw new Error('Backend monitoring smoke test')
  })
}

fastify.get('/api/categories', { schema: routeSchemas.listCategories }, async () => {
  return db('categories').select('id', 'slug', 'name').orderBy('id') // for testing
})

registerCatalog(fastify, db)
registerPromotions(fastify, db)

fastify.addHook('onClose', async () => {
  await db.destroy()
  await Sentry.close(2000)
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void fastify.close().catch((error: unknown) => {
      fastify.log.error(error)
      process.exitCode = 1
    })
  })
}

fastify.listen(
  {
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 3000),
  },
  (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  },
)
