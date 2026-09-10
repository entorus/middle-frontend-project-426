import { extname, resolve } from 'node:path';

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import * as Sentry from '@sentry/node';

import { db } from './db';

const fastify = Fastify({
  logger: true,
});

Sentry.setupFastifyErrorHandler(fastify);

fastify.get('/health-check', (request, reply) => {
  reply.send({ health: 'check' });
});

fastify.register(fastifyStatic, {
  root: resolve(__dirname, '../../front/dist'),
  prefix: '/',
});

fastify.setNotFoundHandler((request, reply) => {
  const pathname = request.url.split('?')[0];
  const isApi = pathname === '/api' || pathname.startsWith('/api/');
  const isPageRequest = request.method === 'GET' || request.method === 'HEAD';
  const isAsset = pathname.startsWith('/assets/') || Boolean(extname(pathname));

  if (isApi || !isPageRequest || isAsset) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Маршрут не найден',
    });
  }

  return reply.code(200).sendFile('index.html');
});

if (process.env.SENTRY_TEST_ENABLED === 'true') {
  fastify.get('/api/debug-sentry', () => {
    throw new Error('Backend monitoring smoke test');
  });
}

fastify.get('/api/categories', async () => {
  return db('categories').select('id', 'slug', 'name').orderBy('id'); // for testing
});

fastify.get('/api/products', async () => {
  return db('products')
    .join('categories', 'categories.id', 'products.category_id')
    .select(
      'products.id',
      'products.sku',
      'products.name',
      'products.description',
      'products.price_kopecks',
      'categories.slug as category_slug',
      'categories.name as category_name',
    )
    .orderBy('products.id');
});

fastify.addHook('onClose', async () => {
  await db.destroy();
  await Sentry.close(2000);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void fastify.close().catch((error: unknown) => {
      fastify.log.error(error);
      process.exitCode = 1;
    });
  });
}

fastify.listen(
  {
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 3000),
  },
  (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  },
);
