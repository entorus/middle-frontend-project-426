import { test, expect } from '@playwright/test'

test('главная показывает промо из API, а не каталог', async ({ page, request }) => {
  const response = await request.get('/api/promotions')
  expect(response.status()).toBe(200)
  const promos = await response.json()
  expect(promos.length).toBeGreaterThanOrEqual(2)
  expect(new Set(promos.map((promo) => promo.product.id)).size).toBe(promos.length)
  expect(promos.every((promo) => promo.product.available)).toBe(true)
  await page.goto('/')
  await expect(page.getByTestId('app-title')).toBeVisible()
  await expect(page.getByTestId('home-promo')).toBeVisible()
  await expect(page.getByTestId('home-promo-item')).toHaveCount(promos.length)
  await expect(page.getByTestId('catalog-filters')).toHaveCount(0)
  for (const [index, promo] of promos.entries()) {
    const card = page.getByTestId('home-promo-item').nth(index)
    await expect(card).toContainText(promo.title)
    await expect(card).toContainText(promo.text)
    await expect(card).toContainText(promo.product.name)
    await expect(card).toHaveAttribute('href', `/products/${promo.product.id}`)
  }
})

test('промо ведёт на ту же страницу товара, что и каталог', async ({ page, request }) => {
  const [promo] = await (await request.get('/api/promotions')).json()
  await page.goto('/')
  await page.getByTestId('home-promo-item').first().click()
  await expect(page).toHaveURL(new RegExp(`/products/${promo.product.id}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(promo.product.name)
  await expect(page.getByTestId('nav-catalog')).toBeVisible()
  await page.getByTestId('nav-catalog').click()
  await page.getByTestId('filter-search').fill(promo.product.name)
  const productLink = page.getByTestId('catalog-item-name').filter({ hasText: promo.product.name })
  await expect(productLink).toHaveAttribute('href', `/products/${promo.product.id}`)
  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`/products/${promo.product.id}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(promo.product.name)
})

test('с главной открывается каталог по ссылке в шапке', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-catalog').click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByTestId('catalog-item').first()).toBeVisible()
  await expect(page.getByTestId('home-promo')).toHaveCount(0)
})

test('пустая подборка не мешает перейти в каталог', async ({ page }) => {
  await page.route('**/api/promotions', (route) => route.fulfill({ json: [] }))
  await page.goto('/')
  await expect(page.getByTestId('home-promo-empty')).toBeVisible()
  await expect(page.getByTestId('home-promo-item')).toHaveCount(0)
  await expect(page.getByTestId('app-title')).toBeVisible()
  await page.getByTestId('nav-catalog').click()
  await expect(page.getByTestId('catalog-item').first()).toBeVisible()
})

test('ошибка подборки показывает повтор; новые тексты приходят из ответа API', async ({ page }) => {
  let requests = 0
  await page.route('**/api/promotions', async (route) => {
    requests += 1
    if (requests === 1) {
      await route.fulfill({
        status: 500,
        json: { statusCode: 500, error: 'Internal Server Error', message: 'Ошибка' },
      })
      return
    }
    const response = await route.fetch()
    const promos = await response.json()
    await route.fulfill({
      json: promos.map((promo) => ({
        ...promo,
        title: `Новая подборка ${promo.id}`,
        text: 'Новый текст без пересборки фронтенда',
      })),
    })
  })
  await page.goto('/')
  await expect(page.getByTestId('home-promo-error')).toBeVisible()
  await page.getByTestId('home-promo-error').getByRole('button').click()
  await expect(page.getByTestId('home-promo-item').first()).toContainText(
    'Новый текст без пересборки фронтенда',
  )
  await expect(page.getByTestId('home-promo-error')).toHaveCount(0)
})
