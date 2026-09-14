import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import { configureContract } from '../../apps/api/dist/contract.js'
import { modelSchemas, routeSchemas } from '../../apps/api/dist/generated/schemas.js'

const requireApi = createRequire(new URL('../../apps/api/package.json', import.meta.url))
const Fastify = requireApi('fastify')
const Ajv = requireApi('ajv/dist/2020').default

test('Money проверяет копейки и валюту без приведения типов', () => {
  const ajv = new Ajv({ strict: false })
  ajv.addFormat('int32', {
    type: 'number',
    validate: (value) => Number.isInteger(value) && value >= -2147483648 && value <= 2147483647,
  })
  const validate = ajv.compile(modelSchemas.Money)
  assert.equal(validate({ amount: 1999000, currency: 'RUB' }), true)
  assert.equal(validate({ amount: 0, currency: 'RUB' }), true)
  for (const value of [
    { amount: -1, currency: 'RUB' },
    { amount: 0.5, currency: 'RUB' },
    { amount: '100', currency: 'RUB' },
    { amount: 100, currency: 'USD' },
    { amount: Number.MAX_SAFE_INTEGER + 1, currency: 'RUB' },
    { amount: 100 },
  ])
    assert.equal(validate(value), false, JSON.stringify(value))
})

test('Fastify валидирует query по сгенерированной схеме', async (t) => {
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  let calls = 0
  app.get('/api/products', { schema: routeSchemas.listProducts }, async () => {
    calls += 1
    return { items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 }
  })
  assert.equal((await app.inject('/api/products?category=processors')).statusCode, 200)
  for (const url of [
    '/api/products?category=',
    '/api/products?category=bad!',
    '/api/products?category=a&category=b',
    '/api/products?page=0',
    '/api/products?page=1.5',
    '/api/products?pageSize=49',
    '/api/products?priceMin=-1',
    '/api/products?available=yes',
    '/api/products?search=',
  ]) {
    const response = await app.inject(url)
    assert.equal(response.statusCode, 400)
    assert.deepEqual(response.json(), {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Некорректный запрос',
    })
  }
  assert.equal(calls, 1, 'Некорректный запрос не должен достигать обработчика')
})

test('Fastify отклоняет ошибочные деньги в ответе и скрывает внутреннюю ошибку', async (t) => {
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  app.get('/api/products', { schema: routeSchemas.listProducts }, async () => ({
    total: 1,
    page: 1,
    pageSize: 12,
    totalPages: 1,
    items: [
      {
        id: 1,
        sku: 'TEST',
        name: 'Test',
        description: 'Test',
        category_slug: 'processors',
        category_name: 'Процессоры',
        price: { amount: -100, currency: 'RUB' },
        available: true,
        image_url: null,
      },
    ],
  }))
  const response = await app.inject('/api/products')
  assert.equal(response.statusCode, 500)
  assert.deepEqual(response.json(), {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Внутренняя ошибка сервера',
  })
})

test('query-схема преобразует числа и boolean, не меняя строгую валидацию body', async (t) => {
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  let parsed
  app.get('/api/products', { schema: routeSchemas.listProducts }, async ({ query }) => {
    parsed = { ...query }
    return { items: [], total: 0, page: query.page, pageSize: query.pageSize, totalPages: 0 }
  })
  const response = await app.inject('/api/products?priceMin=0&priceMax=5000&available=true&page=2')
  assert.equal(response.statusCode, 200)
  assert.deepEqual(parsed, { priceMin: 0, priceMax: 5000, available: true, page: 2, pageSize: 12 })
})

test('ApiError принимает формат ошибок и отвергает неполные ответы', () => {
  const ajv = new Ajv({ strict: false, validateFormats: false })
  const validate = ajv.compile(modelSchemas.ApiError)
  for (const statusCode of [400, 404, 500])
    assert.equal(validate({ statusCode, error: 'Error', message: 'Message' }), true)
  assert.equal(validate({ statusCode: 200, error: 'OK', message: 'Message' }), false)
  assert.equal(validate({ statusCode: 500, message: 'Message' }), false)
})
