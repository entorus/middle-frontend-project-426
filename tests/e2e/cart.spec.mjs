import { test, expect } from '@playwright/test'

const rubles = (amount) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount / 100)
async function productFrom(request, available = true) {
  const response = await request.get(`/api/products?available=${available}`)
  expect(response.status()).toBe(200)
  return (await response.json()).items[0]
}
async function addProduct(page, product) {
  await page.goto(`/products/${product.id}`)
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('1')
}
const storedCart = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('psparts-cart')))

test('кнопка каталога меняется с Купить на В корзине без дополнительной подписи', async ({
  page,
}) => {
  await page.goto('/catalog')
  const card = page.getByTestId('catalog-item').first()
  const button = card.getByTestId('catalog-add-to-cart')
  await expect(button).toHaveText('Купить')
  const border = await button.evaluate((element) => getComputedStyle(element).borderColor)
  const height = (await card.boundingBox()).height
  await button.click()
  await expect(button).toHaveText('В корзине')
  await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(button).toHaveCSS('color', border)
  await expect(button).toHaveCSS('border-color', border)
  await expect(card.getByText(/В корзине:/)).toHaveCount(0)
  await expect(card.getByRole('link', { name: 'Открыть корзину' })).toHaveCount(0)
  expect((await card.boundingBox()).height).toBe(height)
  await page.reload()
  await expect(button).toHaveText('В корзине')
  await button.click()
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByTestId('cart-item-qty')).toHaveValue('1')
  await page.getByTestId('cart-item-remove').click()
  await page.getByTestId('nav-catalog').click()
  await expect(button).toHaveText('Купить')
})

for (const path of ['/', '/catalog']) {
  test(`${path}: кнопка карточки добавляет товар без перехода на его страницу`, async ({
    page,
  }) => {
    await page.goto(path)
    await expect(page.getByRole('link', { name: 'Комплектующие', exact: true })).toBeVisible()
    await expect(page.getByTestId('product-add-to-cart')).toHaveCount(0)
    const button = page
      .getByTestId(path === '/' ? 'home-promo-add-to-cart' : 'catalog-add-to-cart')
      .first()
    await expect(button).toBeEnabled()
    await button.click()
    await expect(page.getByTestId('nav-cart')).toContainText('1')
    expect(new URL(page.url()).pathname).toBe(path)
    await page.getByTestId('nav-cart').click()
    await expect(page.getByTestId('cart-item')).toHaveCount(1)
    await expect(page.getByTestId('cart-item-qty')).toHaveValue('1')
    await expect(page.getByRole('button', { name: 'Обновить цены и наличие' })).toHaveCount(0)
  })
}

test('строка корзины и блок итога соответствуют desktop и mobile раскладке', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await page.setViewportSize({ width: 1440, height: 900 })
  await addProduct(page, product)
  await page.getByTestId('nav-cart').click()
  const row = page.getByTestId('cart-item')
  const summary = page.getByTestId('cart-summary')
  await expect(row.getByTestId('product-illustration')).toBeVisible()
  await row.getByTestId('cart-item-qty').fill('2')
  await expect(row.getByTestId('cart-item-total')).toHaveText(rubles(product.price.amount * 2))
  await expect(page.getByTestId('cart-count')).toHaveText('2')
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(product.price.amount * 2))
  const desktopRow = await row.boundingBox()
  const desktopSummary = await summary.boundingBox()
  expect(desktopRow.x + desktopRow.width).toBeLessThan(desktopSummary.x)
  expect(desktopRow.y).toBe(desktopSummary.y)
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileRow = await row.boundingBox()
  const mobileSummary = await summary.boundingBox()
  expect(mobileRow.y + mobileRow.height).toBeLessThan(mobileSummary.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('цена и итог сохраняют копейки без округления до рублей', async ({ page, request }) => {
  const original = await productFrom(request)
  const product = { ...original, price: { amount: 12345, currency: 'RUB' } }
  await page.route(`**/api/products/${product.id}`, (route) => route.fulfill({ json: product }))
  await page.goto(`/products/${product.id}`)
  await expect(page.getByTestId('product-price')).toHaveText('123,45 ₽')
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('1')
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-total')).toHaveText('123,45 ₽')
  await page.getByTestId('cart-item-qty').fill('3')
  await expect(page.getByTestId('cart-total')).toHaveText('370,35 ₽')
})

test('карточка показывает товар, добавление сохраняет только id и quantity', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await page.goto(`/products/${product.id}`)
  await expect(page.getByTestId('product-name')).toHaveText(product.name)
  await expect(page.getByTestId('product-description')).toHaveText(product.description)
  await expect(page.getByTestId('product-price')).toHaveText(rubles(product.price.amount))
  await expect(page.getByRole('img')).toBeVisible()
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('1')
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toContainText(product.name)
  await expect(page.getByTestId('cart-item-qty')).toHaveValue('1')
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(product.price.amount))
  expect(await storedCart(page)).toEqual([{ id: product.id, quantity: 1 }])
})

test('количество и повторное добавление пересчитывают итог без дублей', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await addProduct(page, product)
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('2')
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toHaveCount(1)
  await page.getByTestId('cart-item-qty').fill('3')
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(product.price.amount * 3))
  expect(await storedCart(page)).toEqual([{ id: product.id, quantity: 3 }])
  await page.getByTestId('cart-item-qty').fill('0')
  await page.getByTestId('cart-total').click()
  await expect(page.getByTestId('cart-item-qty')).toHaveValue('3')
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(product.price.amount * 3))
})

test('удаление последней позиции показывает пустую корзину и блокирует оформление', async ({
  page,
  request,
}) => {
  await addProduct(page, await productFrom(request))
  await page.getByTestId('nav-cart').click()
  await page.getByTestId('cart-item-remove').click()
  await expect(page.getByTestId('cart-empty')).toBeVisible()
  await expect(page.getByTestId('cart-item')).toHaveCount(0)
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(0))
  await expect(page.getByTestId('cart-checkout')).toBeDisabled()
  await expect(page.getByTestId('nav-cart')).toHaveText('Корзина')
  expect(await storedCart(page)).toEqual([])
})

test('корзина сохраняется после перезагрузки и доступна с любой страницы', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await addProduct(page, product)
  await page.getByTestId('nav-cart').click()
  await page.getByTestId('cart-item-qty').fill('4')
  await page.reload()
  await expect(page.getByTestId('cart-item')).toContainText(product.name)
  await expect(page.getByTestId('cart-item-qty')).toHaveValue('4')
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(product.price.amount * 4))
  for (const path of ['/', '/catalog', '/signin']) {
    await page.goto(path)
    await expect(page.getByTestId('nav-cart')).toContainText('4')
  }
})

test('недоступный товар добавить нельзя', async ({ page, request }) => {
  const product = await productFrom(request, false)
  await page.goto(`/products/${product.id}`)
  await expect(page.getByTestId('product-name')).toHaveText(product.name)
  await expect(page.getByTestId('product-add-to-cart')).toBeDisabled()
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-empty')).toBeVisible()
})

test('пустая корзина не пускает к оформлению даже по прямому адресу', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.getByTestId('cart-empty')).toBeVisible()
  await expect(page.getByTestId('cart-checkout')).toBeDisabled()
  await page.goto('/checkout')
  await expect(page).toHaveURL(/\/signin\?next=checkout$/)
  await expect(page.getByTestId('checkout-form')).toHaveCount(0)
})

test('свежие цена и название загружаются из API, не из localStorage', async ({ page, request }) => {
  const product = await productFrom(request)
  await addProduct(page, product)
  const updated = {
    ...product,
    name: 'Новое название товара',
    price: { ...product.price, amount: product.price.amount + 100000 },
  }
  await page.route(`**/api/products/${product.id}`, (route) => route.fulfill({ json: updated }))
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toContainText(updated.name)
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(updated.price.amount))
  expect(await storedCart(page)).toEqual([{ id: product.id, quantity: 1 }])
  await page.getByTestId('cart-checkout').click()
  await expect(page).toHaveURL(/\/signin\?next=checkout$/)
  expect(await storedCart(page)).toEqual([{ id: product.id, quantity: 1 }])
})

test('исчезнувший товар отмечен, не включён в итог и может быть удалён', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await addProduct(page, product)
  await page.route(`**/api/products/${product.id}`, (route) =>
    route.fulfill({
      status: 404,
      json: { statusCode: 404, error: 'Not Found', message: 'Товар не найден' },
    }),
  )
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toContainText('Товар удалён из каталога')
  await expect(page.getByTestId('cart-checkout')).toBeDisabled()
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(0))
  await page.getByTestId('cart-item-remove').click()
  await expect(page.getByTestId('cart-empty')).toBeVisible()
})

test('изменившееся наличие проверяется перед добавлением и в корзине', async ({
  page,
  request,
}) => {
  const product = await productFrom(request)
  await addProduct(page, product)
  await page.route(`**/api/products/${product.id}`, (route) =>
    route.fulfill({ json: { ...product, available: false } }),
  )
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByRole('alert')).toContainText('Товар больше не доступен')
  expect(await storedCart(page)).toEqual([{ id: product.id, quantity: 1 }])
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toContainText('Больше нет в наличии')
  await expect(page.getByTestId('cart-checkout')).toBeDisabled()
})

test('итог складывает несколько позиций и пересчитывается при удалении одной', async ({
  page,
  request,
}) => {
  const {
    items: [first, second],
  } = await (await request.get('/api/products?available=true')).json()
  await addProduct(page, first)
  await page.goto(`/products/${second.id}`)
  await page.getByTestId('product-add-to-cart').click()
  await expect(page.getByTestId('nav-cart')).toContainText('2')
  await page.getByTestId('nav-cart').click()
  await expect(page.getByTestId('cart-item')).toHaveCount(2)
  await expect(page.getByTestId('cart-total')).toHaveText(
    rubles(first.price.amount + second.price.amount),
  )
  await page.getByTestId('cart-item').first().getByTestId('cart-item-qty').fill('2')
  await expect(page.getByTestId('cart-total')).toHaveText(
    rubles(first.price.amount * 2 + second.price.amount),
  )
  await page.getByTestId('cart-item').first().getByTestId('cart-item-remove').click()
  await expect(page.getByTestId('cart-item')).toHaveCount(1)
  await expect(page.getByTestId('cart-total')).toHaveText(rubles(second.price.amount))
})

test('повреждённый localStorage не ломает корзину', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('psparts-cart', '{broken-json'))
  await page.goto('/cart')
  await expect(page.getByTestId('cart-empty')).toBeVisible()
  await expect(page.getByTestId('cart-checkout')).toBeDisabled()
})
