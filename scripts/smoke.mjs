import assert from 'node:assert/strict'

const base = new URL(process.env.SMOKE_URL ?? 'http://127.0.0.1:3000')
assert.ok(
  ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname),
  'Smoke-проверка предназначена только для локального сервера',
)
async function request(path, status = 200, type = 'application/json', method = 'GET') {
  const response = await fetch(new URL(path, base), { method, signal: AbortSignal.timeout(10000) })
  assert.equal(response.status, status, `${method} ${path}: неверный статус`)
  assert.ok(response.headers.get('content-type')?.includes(type), `${path}: неверный Content-Type`)
  return response
}

await request('/health-check')
for (const path of ['/', '/catalog', '/catalog?category=processors', '/unknown-page']) {
  const response = await request(path, 200, 'text/html')
  assert.match(await response.text(), /id="root"/)
}
for (const path of [
  '/api',
  '/api?test=1',
  '/api/unknown',
  '/api/unknown?test=1',
  '/assets/missing.js',
  '/favicon.ico',
]) {
  await request(path, 404)
}
await request('/unknown-page', 404, 'application/json', 'POST')
await request('/catalog', 200, 'text/html', 'HEAD')
const categories = await (await request('/api/categories')).json()
const products = await (await request('/api/products')).json()
assert.ok(categories.some((category) => category.slug === 'processors'))
assert.ok(categories.some((category) => category.slug === 'graphics-cards'))
assert.ok(products.length >= 6)
assert.equal(new Set(products.map((product) => product.sku)).size, products.length)
assert.ok(
  products.every(
    (product) =>
      Number.isInteger(product.price.amount) &&
      product.price.amount >= 0 &&
      product.price.currency === 'RUB',
  ),
)
await request('/api/debug-sentry', process.env.EXPECT_SENTRY_TEST === 'true' ? 500 : 404)
await request('/api/products?category=invalid!', 400)
await request('/api/products?category=unknown-category', 404)
const filtered = await (await request('/api/products?category=processors')).json()
assert.ok(
  filtered.length > 0 && filtered.every((product) => product.category_slug === 'processors'),
)
process.stdout.write(
  `Smoke OK: SPA, API 404, static 404, ${categories.length} categories, ${products.length} products\n`,
)
