import { randomUUID } from 'node:crypto'

import { test, expect } from '@playwright/test'

const money = (amount) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount / 100)
const receiving = { method: 'pickup', name: 'Иван Покупатель', phone: '+79991234567' }
async function signup(client) {
  const data = { email: `order-${randomUUID()}@example.com`, password: 'Order-password-123' }
  expect((await client.post('/api/auth/signup', { data })).status()).toBe(200)
}
async function prepare(page, request) {
  await signup(page.request)
  const {
    items: [product],
  } = await (await request.get('/api/products?available=true')).json()
  await page.goto(`/products/${product.id}`)
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('1')
  await page.getByTestId('nav-cart').click()
  await page.getByTestId('cart-checkout').click()
  await expect(page.getByTestId('checkout-form')).toBeVisible()
  return product
}
async function fill(page, method = 'pickup') {
  await page.getByTestId('checkout-method').selectOption(method)
  await page.getByTestId('checkout-name').fill(receiving.name)
  await page.getByTestId('checkout-phone').fill(receiving.phone)
  if (method === 'delivery')
    await page.getByTestId('checkout-address').fill('ул. Тестовая, д. 10, кв. 2')
}

test('оформление самовывоза, очистка корзины и история со снимком', async ({ page, request }) => {
  const product = await prepare(page, request)
  await fill(page)
  await expect(page.getByTestId('checkout-address')).toHaveCount(0)
  const posted = page.waitForRequest(
    (req) => req.method() === 'POST' && new URL(req.url()).pathname === '/api/orders',
  )
  await page.getByTestId('checkout-submit').click()
  expect((await posted).postDataJSON()).toEqual({
    items: [{ id: product.id, quantity: 1 }],
    receiving,
  })
  await expect(page.getByTestId('order-success')).toBeVisible()
  await expect(page.getByTestId('order-total')).toHaveText(money(product.price.amount))
  await expect(page.getByTestId('order-status')).toHaveAttribute('data-status', 'paid')
  await expect(page.getByTestId('order-success')).toContainText(product.name)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('psparts-cart')))).toEqual([])
  await page.reload()
  await expect(page.getByTestId('order-success')).toBeVisible()
  await page.getByTestId('nav-account').click()
  await expect(page.getByTestId('account-order-item')).toHaveCount(1)
  await expect(page.getByTestId('account-order-item')).toContainText(product.name)
  await expect(page.getByTestId('account-order-item')).toContainText('1 шт.')
  await expect(page.getByTestId('order-total')).toHaveText(money(product.price.amount))
  await expect(page.getByTestId('order-status')).toHaveAttribute('data-status', 'paid')
})

test('доставка требует адрес; успешный заказ содержит адрес', async ({ page, request }) => {
  await prepare(page, request)
  await fill(page, 'delivery')
  await page.getByTestId('checkout-address').fill('')
  await page.getByTestId('checkout-submit').click()
  await expect(page.getByTestId('order-success')).toHaveCount(0)
  expect(
    await page.getByTestId('checkout-address').evaluate((input) => input.validity.valueMissing),
  ).toBe(true)
  await page.getByTestId('checkout-address').fill('ул. Тестовая, д. 10')
  await page.getByTestId('checkout-submit').click()
  await expect(page.getByTestId('order-success')).toContainText('ул. Тестовая, д. 10')
})

test('гость и пустая корзина не могут оформить заказ', async ({ page, request }) => {
  expect((await request.post('/api/orders', { data: { items: [], receiving } })).status()).toBe(401)
  await page.goto('/checkout')
  await expect(page).toHaveURL(/\/signin\?next=checkout$/)
  await signup(page.request)
  await page.goto('/checkout')
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByTestId('cart-empty')).toBeVisible()
  expect(
    (await page.request.post('/api/orders', { data: { items: [], receiving } })).status(),
  ).toBe(400)
})

test('атомарный отказ показывает проблемный товар и сохраняет корзину', async ({
  page,
  request,
}) => {
  await signup(page.request)
  const available = (await (await request.get('/api/products?available=true')).json()).items[0]
  const unavailable = (await (await request.get('/api/products?available=false')).json()).items[0]
  await page.goto('/')
  const items = [
    { id: available.id, quantity: 1 },
    { id: unavailable.id, quantity: 1 },
  ]
  await page.evaluate((cart) => localStorage.setItem('psparts-cart', JSON.stringify(cart)), items)
  await page.goto('/checkout')
  await fill(page)
  await page.getByTestId('checkout-submit').click()
  await expect(page.getByTestId('order-error')).toContainText(`Товар №${unavailable.id}`)
  await expect(page.getByTestId('order-error')).toContainText('нет в наличии')
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('psparts-cart')))).toEqual(items)
  expect(await (await page.request.get('/api/orders')).json()).toEqual([])
})

test('кабинет и API показывают только собственные заказы', async ({ page, request }) => {
  const product = await prepare(page, request)
  await fill(page)
  await page.getByTestId('checkout-submit').click()
  await expect(page.getByTestId('order-success')).toBeVisible()
  const [order] = await (await page.request.get('/api/orders')).json()
  await signup(request)
  expect((await request.get(`/api/orders/${order.id}`)).status()).toBe(404)
  expect(await (await request.get('/api/orders')).json()).toEqual([])
  await page.getByTestId('nav-signout').click()
  await signup(page.request)
  await page.goto('/account')
  await expect(page.getByTestId('account-orders-empty')).toBeVisible()
  await expect(page.getByTestId('account-order-item')).toHaveCount(0)
  await expect(page.getByTestId('account-orders')).not.toContainText(product.name)
})

test('подмена цен и итога отклоняется, сервер считает по каталогу', async ({ request }) => {
  await signup(request)
  const {
    items: [product],
  } = await (await request.get('/api/products?available=true')).json()
  const payload = { items: [{ id: product.id, quantity: 3 }], receiving }
  expect((await request.post('/api/orders', { data: { ...payload, total: 1 } })).status()).toBe(400)
  expect(
    (
      await request.post('/api/orders', {
        data: { ...payload, items: [{ id: product.id, quantity: 3, price: 1 }] },
      })
    ).status(),
  ).toBe(400)
  const created = await request.post('/api/orders', { data: payload })
  expect(created.status()).toBe(201)
  const order = await created.json()
  expect(order.total.amount).toBe(product.price.amount * 3)
  expect(order.total.amount).toBe(
    order.items.reduce((sum, item) => sum + item.quantity * item.price.amount, 0),
  )
})
