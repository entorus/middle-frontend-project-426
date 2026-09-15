import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import { hashPassword, verifyPassword } from '../../apps/api/dist/password.js'
import { configureContract } from '../../apps/api/dist/contract.js'
import { routeSchemas } from '../../apps/api/dist/generated/schemas.js'
import { registerAuth } from '../../apps/api/dist/auth.js'

const requireApi = createRequire(new URL('../../apps/api/package.json', import.meta.url))
const Fastify = requireApi('fastify')

test('production HTTP и HTTPS: Secure определяется транспортом, не NODE_ENV', async (t) => {
  const saved = Object.fromEntries(
    ['NODE_ENV', 'COOKIE_SECURE', 'APP_ORIGIN'].map((name) => [name, process.env[name]]),
  )
  t.after(() => {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  })
  process.env.NODE_ENV = 'production'
  delete process.env.COOKIE_SECURE
  delete process.env.APP_ORIGIN
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  registerAuth(app, () => {
    throw new Error('Гостевой выход не должен обращаться к БД')
  })
  async function check(secure, headers = {}) {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/signout',
      headers: { host: 'online-store.test:8080', ...headers },
    })
    assert.equal(response.statusCode, 200)
    const cookie = response.headers['set-cookie']
    assert.equal(cookie.includes('; Secure'), secure)
    assert.match(cookie, /HttpOnly; SameSite=Lax; Max-Age=0/)
  }
  await check(false)
  await check(true, { 'x-forwarded-proto': 'https' })
  await check(false, { 'x-forwarded-proto': 'http' })
  process.env.APP_ORIGIN = 'https://shop.example.com'
  await check(true, { 'x-forwarded-proto': 'http' })
  delete process.env.APP_ORIGIN
  process.env.COOKIE_SECURE = 'true'
  await check(true)
  process.env.COOKIE_SECURE = 'false'
  await check(false)
})

test('auth routes: гость, невалидная cookie, выход и CSRF без обращения к БД', async (t) => {
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  registerAuth(app, () => {
    throw new Error('Запрос не должен обращаться к БД')
  })
  for (const headers of [{}, { cookie: 'psparts_session=invalid' }]) {
    const response = await app.inject({ url: '/api/auth/me', headers })
    assert.equal(response.statusCode, 401)
    assert.deepEqual(response.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Необходимо войти в аккаунт',
    })
    assert.equal(response.headers['cache-control'], 'no-store')
  }
  const logout = await app.inject({ method: 'POST', url: '/api/auth/signout' })
  assert.equal(logout.statusCode, 200)
  assert.deepEqual(logout.json(), { success: true })
  assert.match(logout.headers['set-cookie'], /Max-Age=0/)
  for (const headers of [
    { origin: 'https://evil.example' },
    { origin: 'null' },
    { 'sec-fetch-site': 'cross-site' },
  ]) {
    const response = await app.inject({ method: 'POST', url: '/api/auth/signout', headers })
    assert.equal(response.statusCode, 400)
    assert.equal(response.json().message, 'Недопустимый источник запроса')
  }
  const invalid = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: { email: 'invalid', password: 'password123' },
  })
  assert.equal(invalid.statusCode, 400)
})

test('пароли хешируются с независимой солью и проверяются без усечения', async () => {
  const password = 'test-password-123'
  const first = await hashPassword(password)
  const second = await hashPassword(password)
  assert.notEqual(first, second)
  assert.equal(first.includes(password), false)
  assert.equal(await verifyPassword(password, first), true)
  assert.equal(await verifyPassword(`${password}wrong`, first), false)
  assert.equal(await verifyPassword('wrong', first), false)
  assert.equal(await verifyPassword(password, 'invalid'), false)
})

test('сгенерированная схема отсекает неверные credentials до обработчика', async (t) => {
  const app = Fastify()
  t.after(() => app.close())
  configureContract(app)
  let calls = 0
  app.post('/signup', { schema: routeSchemas.signup }, async () => {
    calls += 1
    return { id: 1, email: 'user@example.com' }
  })
  const valid = { email: 'user@example.com', password: 'password123' }
  assert.equal(
    (await app.inject({ method: 'POST', url: '/signup', payload: valid })).statusCode,
    200,
  )
  for (const payload of [
    { ...valid, email: '' },
    { ...valid, email: 'invalid' },
    { ...valid, password: '' },
    { ...valid, password: 'a'.repeat(129) },
    { email: valid.email },
    { ...valid, email: 123 },
  ]) {
    assert.equal((await app.inject({ method: 'POST', url: '/signup', payload })).statusCode, 400)
  }
  assert.equal(calls, 1)
})
