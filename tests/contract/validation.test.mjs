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
    { amount: 2147483648, currency: 'RUB' },
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
    return []
  })
  assert.equal((await app.inject('/api/products?category=processors')).statusCode, 200)
  for (const url of [
    '/api/products?category=',
    '/api/products?category=bad!',
    '/api/products?category=a&category=b',
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
  app.get('/api/products', { schema: routeSchemas.listProducts }, async () => [
    {
      id: 1,
      sku: 'TEST',
      name: 'Test',
      description: 'Test',
      category_slug: 'processors',
      category_name: 'Процессоры',
      price: { amount: -100, currency: 'RUB' },
    },
  ])
  const response = await app.inject('/api/products')
  assert.equal(response.statusCode, 500)
  assert.deepEqual(response.json(), {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Внутренняя ошибка сервера',
  })
})

test('ApiError принимает формат ошибок и отвергает неполные ответы', () => {
  const ajv = new Ajv({ strict: false, validateFormats: false })
  const validate = ajv.compile(modelSchemas.ApiError)
  for (const statusCode of [400, 404, 500])
    assert.equal(validate({ statusCode, error: 'Error', message: 'Message' }), true)
  assert.equal(validate({ statusCode: 200, error: 'OK', message: 'Message' }), false)
  assert.equal(validate({ statusCode: 500, message: 'Message' }), false)
})
