import assert from 'node:assert/strict'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import test from 'node:test'

import { configureContract } from '../../apps/api/dist/contract.js'
import { registerOrders } from '../../apps/api/dist/orders.js'
import { hashPassword } from '../../apps/api/dist/password.js'

const requireApi = createRequire(new URL('../../apps/api/package.json', import.meta.url))
const knex = requireApi('knex')
const Fastify = requireApi('fastify')

test('заказы: серверная цена, атомарность, снимки и изоляция пользователей', async () => {
  assert.ok(process.env.TEST_DATABASE_URL)
  const db = knex({ client: 'pg', connection: process.env.TEST_DATABASE_URL })
  const app = Fastify()
  let tx
  try {
    tx = await db.transaction()
    configureContract(app)
    registerOrders(app, tx)
    const passwordHash = await hashPassword('Order-test-password')
    async function makeUser() {
      const [user] = await tx('users')
        .insert({ email: `${randomUUID()}@example.com`, password_hash: passwordHash })
        .returning('*')
      const token = randomBytes(32).toString('base64url')
      await tx('sessions').insert({
        token_hash: createHash('sha256').update(token).digest('hex'),
        user_id: user.id,
        expires_at: new Date(Date.now() + 60000),
      })
      return { user, cookie: `psparts_session=${token}` }
    }
    const first = await makeUser()
    const second = await makeUser()
    const category = await tx('categories').first()
    const [product, unavailable] = await tx('products')
      .insert([
        {
          sku: randomUUID(),
          name: 'Снимок товара',
          description: 'Test',
          category_id: category.id,
          price_kopecks: 5999000,
          available: true,
        },
        {
          sku: randomUUID(),
          name: 'Unavailable',
          description: 'Test',
          category_id: category.id,
          price_kopecks: 10000,
          available: false,
        },
      ])
      .returning('*')
    const receiving = { method: 'pickup', name: 'Покупатель', phone: '+79991234567' }
    const payload = { items: [{ id: product.id, quantity: 999 }], receiving }
    const post = (body, cookie = first.cookie) =>
      app.inject({ method: 'POST', url: '/api/orders', headers: { cookie }, payload: body })
    assert.equal(
      (await app.inject({ method: 'POST', url: '/api/orders', payload })).statusCode,
      401,
    )
    for (const invalid of [
      { ...payload, total: 1 },
      { ...payload, user_id: second.user.id },
      { ...payload, items: [{ id: product.id, quantity: 1, price: 1 }] },
      { ...payload, items: [] },
      { ...payload, items: [{ id: product.id, quantity: 0 }] },
      { ...payload, items: [{ id: product.id, quantity: 1.5 }] },
      { ...payload, receiving: { ...receiving, method: 'delivery' } },
      { ...payload, receiving: { ...receiving, phone: '-------' } },
      { ...payload, receiving: { ...receiving, address: 'Не нужен' } },
    ])
      assert.equal((await post(invalid)).statusCode, 400)
    const before = Number(
      (await tx('orders').where('user_id', first.user.id).count({ count: '*' }).first()).count,
    )
    const failed = await post({
      ...payload,
      items: [
        { id: product.id, quantity: 1 },
        { id: unavailable.id, quantity: 1 },
        { id: 2147483647, quantity: 1 },
      ],
    })
    assert.equal(failed.statusCode, 409)
    assert.deepEqual(failed.json().products, [
      { id: unavailable.id, reason: 'unavailable' },
      { id: 2147483647, reason: 'not_found' },
    ])
    assert.equal(
      Number(
        (await tx('orders').where('user_id', first.user.id).count({ count: '*' }).first()).count,
      ),
      before,
    )
    const created = await post(payload)
    assert.equal(created.statusCode, 201, created.body)
    const order = created.json()
    assert.equal(order.total.amount, product.price_kopecks * 999)
    assert.equal(order.items[0].price.amount, product.price_kopecks)
    assert.equal(order.status, 'paid')
    assert.equal(order.receiving.method, 'pickup')
    assert.equal('address' in order.receiving, false)
    await tx('products')
      .where('id', product.id)
      .update({ name: 'Новое название', price_kopecks: 1, available: false })
    await tx('products').where('id', product.id).delete()
    const own = await app.inject({
      url: `/api/orders/${order.id}`,
      headers: { cookie: first.cookie },
    })
    assert.deepEqual(own.json(), order, 'Снимок не зависит от удалённого товара')
    const foreign = await app.inject({
      url: `/api/orders/${order.id}`,
      headers: { cookie: second.cookie },
    })
    assert.equal(foreign.statusCode, 404)
    const others = await app.inject({ url: '/api/orders', headers: { cookie: second.cookie } })
    assert.deepEqual(others.json(), [])
    const mine = await app.inject({ url: '/api/orders', headers: { cookie: first.cookie } })
    assert.deepEqual(mine.json(), [order])
    const csrf = await app.inject({
      method: 'POST',
      url: '/api/orders',
      headers: { cookie: first.cookie, origin: 'https://evil.example' },
      payload,
    })
    assert.equal(csrf.statusCode, 400)
  } finally {
    await app.close()
    if (tx) await tx.rollback()
    await db.destroy()
  }
})
