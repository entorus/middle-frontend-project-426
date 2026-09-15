import { setTimeout as delay } from 'node:timers/promises'

import { test, expect } from '@playwright/test'

async function expectResults(page, request, query = '') {
  const response = await request.get(`/api/products?${query}`)
  expect(response.status()).toBe(200)
  const result = await response.json()
  await expect(page.getByTestId('catalog-item-name')).toHaveText(
    result.items.map((item) => item.name),
  )
  await expect(page.getByTestId('catalog-total')).toHaveText(`Найдено товаров: ${result.total}`)
  return result
}

test('карточки содержат цену, наличие, изображение или заглушку и ссылку на товар', async ({
  page,
  request,
}) => {
  await page.goto('/catalog')
  const result = await expectResults(page, request)
  expect(result.items.length).toBe(12)
  for (const [index, item] of result.items.entries()) {
    const card = page.getByTestId('catalog-item').nth(index)
    await expect(card.getByTestId('catalog-item-name')).toHaveAttribute(
      'href',
      `/products/${item.id}`,
    )
    await expect(card.getByTestId('catalog-item-price')).toHaveText(
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(item.price.amount / 100),
    )
    await expect(card.getByTestId('catalog-item-availability')).toHaveAttribute(
      'data-available',
      String(item.available),
    )
    await expect(card.getByRole('img')).toBeVisible()
  }
  expect(result.items.some((item) => !item.available)).toBe(true)
  expect(result.items.some((item) => item.image_url === null)).toBe(true)
  await page.getByTestId('catalog-item-name').first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(result.items[0].name)
  await expect(page.getByTestId('nav-catalog')).toBeVisible()
})

test('категория, цена и наличие комбинируются; контролы реагируют сразу', async ({
  page,
  request,
}) => {
  await page.goto('/catalog')
  await expectResults(page, request)
  await page.getByTestId('filter-category').selectOption('memory')
  const category = await expectResults(page, request, 'category=memory')
  expect(category.items.every((item) => item.category_slug === 'memory')).toBe(true)
  await page.getByTestId('filter-price-min').fill('2000')
  await page.getByTestId('filter-price-max').fill('5000')
  const checked = await page.getByTestId('filter-available').evaluate((input) => {
    input.click()
    return input.checked
  })
  expect(checked).toBe(true)
  await expect(page.getByTestId('filter-available')).toBeChecked()
  const result = await expectResults(
    page,
    request,
    'category=memory&priceMin=2000&priceMax=5000&available=true',
  )
  expect(result.total).toBeLessThan(category.total)
  expect(
    result.items.every(
      (item) => item.available && item.price.amount >= 200000 && item.price.amount <= 500000,
    ),
  ).toBe(true)
  await page.getByTestId('filter-reset').click()
  await expectResults(page, request)
  await expect(page.getByTestId('filter-category')).toHaveValue('')
  await expect(page.getByTestId('filter-price-min')).toHaveValue('')
  await expect(page.getByTestId('filter-price-max')).toHaveValue('')
  await expect(page.getByTestId('filter-available')).not.toBeChecked()
})

test('поиск по части названия отложен и применяется на сервере', async ({ page, request }) => {
  await page.goto('/catalog')
  await expectResults(page, request)
  const searches = []
  page.on('request', (req) => {
    if (req.url().includes('/api/products?') && new URL(req.url()).searchParams.has('search'))
      searches.push(req.url())
  })
  await page.getByTestId('filter-search').pressSequentially('Ryzen', { delay: 30 })
  await expect(page.getByTestId('filter-search')).toHaveValue('Ryzen')
  const result = await expectResults(page, request, 'search=Ryzen')
  expect(result.items.length).toBeGreaterThan(0)
  expect(result.items.every((item) => item.name.includes('Ryzen'))).toBe(true)
  expect(searches).toHaveLength(1)
  await page.getByTestId('filter-reset').click()
  await expect(page.getByTestId('filter-search')).toHaveValue('')
  await expectResults(page, request)
})

for (const [field, parameter] of [
  ['filter-price-min', 'priceMin'],
  ['filter-price-max', 'priceMax'],
]) {
  test(`${parameter}: ввод цифр отправляет один запрос после паузы`, async ({ page, request }) => {
    await page.goto('/catalog')
    const initial = await expectResults(page, request)
    await page.clock.install()
    await page.clock.pauseAt(new Date())
    const queries = []
    page.on('request', (req) => {
      const url = new URL(req.url())
      if (url.pathname === '/api/products') queries.push(url.search)
    })
    const input = page.getByTestId(field)
    await input.focus()
    for (const digit of '20000') {
      await input.press(digit)
      await page.clock.runFor(100)
    }
    await expect(input).toHaveValue('20000')
    expect(queries).toEqual([])
    await expect(page.getByTestId('catalog-item-name')).toHaveText(
      initial.items.map((item) => item.name),
    )
    await page.clock.runFor(250)
    await expectResults(page, request, `${parameter}=20000`)
    expect(queries).toEqual([`?${parameter}=20000`])

    await input.fill('30000')
    await page.getByTestId('filter-reset').click()
    await page.clock.runFor(500)
    await expect(input).toHaveValue('')
    await expectResults(page, request)
    expect(queries.some((query) => query.includes('30000'))).toBe(false)
  })
}

test('пустая комбинация фильтров показывает явное состояние', async ({ page }) => {
  await page.goto('/catalog?category=memory&priceMin=100000&available=true')
  await expect(page.getByTestId('catalog-empty')).toBeVisible()
  await expect(page.getByTestId('catalog-item')).toHaveCount(0)
  await expect(page.getByTestId('catalog-page-next')).toBeDisabled()
})

test('пагинация меняет товары и фильтр возвращает на первую страницу', async ({
  page,
  request,
}) => {
  await page.goto('/catalog')
  const first = await expectResults(page, request)
  await expect(page.getByTestId('catalog-page-prev')).toBeDisabled()
  await page.getByTestId('catalog-page-next').click()
  const second = await expectResults(page, request, 'page=2')
  expect(second.items.some((item) => first.items.some((previous) => previous.id === item.id))).toBe(
    false,
  )
  await page.getByTestId('catalog-page-next').click()
  await expectResults(page, request, 'page=3')
  await page.reload()
  await expectResults(page, request, 'page=3')
  await page.getByTestId('filter-category').selectOption('memory')
  await expectResults(page, request, 'category=memory')
  await expect(page.getByTestId('catalog-page-prev')).toBeDisabled()
  expect(new URL(page.url()).searchParams.get('page')).toBeNull()
})

test('перезагрузка и история восстанавливают все фильтры', async ({ page, request }) => {
  const original = 'category=memory&priceMin=2000&priceMax=10000&available=true&search=DDR5'
  await page.goto(`/catalog?${original}`)
  await expectResults(page, request, original)
  await page.reload()
  await expectResults(page, request, original)
  await expect(page.getByTestId('filter-category')).toHaveValue('memory')
  await expect(page.getByTestId('filter-price-min')).toHaveValue('2000')
  await expect(page.getByTestId('filter-price-max')).toHaveValue('10000')
  await expect(page.getByTestId('filter-search')).toHaveValue('DDR5')
  await expect(page.getByTestId('filter-available')).toBeChecked()
  await page.getByTestId('filter-reset').click()
  await expectResults(page, request)
  await page.goBack()
  await expectResults(page, request, original)
  await expect(page.getByTestId('filter-available')).toBeChecked()
  await expect(page.getByTestId('filter-search')).toHaveValue('DDR5')
  await page.goForward()
  await expectResults(page, request)
  await expect(page.getByTestId('filter-search')).toHaveValue('')
})

test('устаревший поисковый запрос отменяется', async ({ page, request }) => {
  await page.route('**/api/products?*', async (route) => {
    if (new URL(route.request().url()).searchParams.get('search') === 'Ryzen') {
      const response = await route.fetch()
      await delay(1200)
      await route.fulfill({ response }).catch(() => {})
    } else await route.continue()
  })
  await page.goto('/catalog')
  await expectResults(page, request)
  const failed = page.waitForEvent('requestfailed', {
    predicate: (req) => req.url().includes('search=Ryzen'),
  })
  const started = page.waitForRequest((req) => req.url().includes('search=Ryzen'))
  await page.getByTestId('filter-search').fill('Ryzen')
  await started
  await page.getByTestId('filter-search').fill('GeForce')
  await expectResults(page, request, 'search=GeForce')
  await failed
  await delay(1300)
  await expectResults(page, request, 'search=GeForce')
})

test('API валидирует диапазоны и параметры; поиск не трактует SQL wildcard', async ({
  request,
}) => {
  for (const query of [
    'page=0',
    'pageSize=1000',
    'priceMin=-1',
    'priceMax=abc',
    'available=maybe',
    'priceMin=200&priceMax=100',
    'page=2&page=3',
  ]) {
    const response = await request.get(`/api/products?${query}`)
    expect(response.status()).toBe(400)
    expect(await response.json()).toMatchObject({ statusCode: 400, message: expect.any(String) })
  }
  const response = await request.get('/api/products?search=%25')
  expect((await response.json()).items).toEqual([])
})

test('фильтры слева на десктопе и над выдачей на мобильном', async ({ page, request }) => {
  await page.goto('/catalog')
  await expectResults(page, request)
  const filters = await page.getByTestId('catalog-filters').boundingBox()
  const list = await page.getByTestId('catalog-list').boundingBox()
  expect(filters.x + filters.width).toBeLessThan(list.x)
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileFilters = await page.getByTestId('catalog-filters').boundingBox()
  const mobileList = await page.getByTestId('catalog-list').boundingBox()
  expect(mobileFilters.y + mobileFilters.height).toBeLessThan(mobileList.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
