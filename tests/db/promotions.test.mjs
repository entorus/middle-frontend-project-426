import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import { configureContract } from '../../apps/api/dist/contract.js'
import { registerPromotions } from '../../apps/api/dist/promotions.js'
import { seed } from '../../apps/api/dist/db/seeds/004_promotions.js'

const requireApi = createRequire(new URL('../../apps/api/package.json', import.meta.url))
const knex = requireApi('knex')
const Fastify = requireApi('fastify')

test('PostgreSQL: уникальные товары, доступность, тексты из БД, пустая подборка и повторный сид', async () => {
  assert.ok(
    process.env.TEST_DATABASE_URL,
    'Передайте TEST_DATABASE_URL тестовой PostgreSQL с применёнными миграциями',
  )
  const db = knex({ client: 'pg', connection: process.env.TEST_DATABASE_URL })
  const app = Fastify()
  let tx
  try {
    tx = await db.transaction()
    configureContract(app)
    registerPromotions(app, tx)
    const getPromos = async () => {
      const response = await app.inject('/api/promotions')
      assert.equal(response.statusCode, 200)
      return response.json()
    }
    const initial = await getPromos()
    assert.ok(initial.length >= 2)
    assert.ok(initial.every((promo) => promo.product.available))
    const count = Number((await tx('promotions').count({ count: '*' }).first()).count)
    await seed(tx)
    assert.equal(Number((await tx('promotions').count({ count: '*' }).first()).count), count)
    const first = initial[0]
    await assert.rejects(
      tx.transaction((savepoint) =>
        savepoint('promotions').insert({
          title: 'Duplicate',
          text: 'Duplicate',
          product_id: first.product.id,
        }),
      ),
      { code: '23505' },
    )
    await tx('promotions')
      .where('id', first.id)
      .update({ title: 'Новый заголовок из БД', text: 'Новый текст из БД' })
    await seed(tx)
    assert.equal(
      (await getPromos()).find((promo) => promo.id === first.id).text,
      'Новый текст из БД',
    )
    await tx('products').where('id', first.product.id).update({ available: false })
    assert.equal(
      (await getPromos()).some((promo) => promo.id === first.id),
      false,
    )
    // Changes, including this empty-state check, are rolled back and never committed.
    await tx('promotions').delete()
    assert.deepEqual(await getPromos(), [])
  } finally {
    await app.close()
    if (tx) await tx.rollback()
    await db.destroy()
  }
})
