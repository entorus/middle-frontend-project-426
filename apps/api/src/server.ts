import { resolve } from 'node:path'


import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';

import { db } from './db'

const fastify = Fastify({
  logger: true,
});

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

  if (isApi || !isPageRequest) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Маршрут не найден',
    });
  }

  return reply.code(200).sendFile('index.html');
});

fastify.get('/api/categories', async () => {
  return db('categories').select('id', 'slug', 'name').orderBy('id'); // for testing
})

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

fastify.addHook('onClose', async () => {
  await db.destroy();
})