import { test, expect } from '@playwright/test'

test('главная открывается и показывает каталог из базы', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  const response = await page.goto('/')
  expect(response.status()).toBe(200)
  await expect(page.getByTestId('app-title')).toBeVisible()
  await expect(page.getByTestId('catalog')).toBeVisible()
  await expect(page.getByTestId('product-card').first()).toBeVisible()
  await expect(page.getByTestId('catalog-error')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('клиентский маршрут и фильтр сохраняются после перезагрузки', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('catalog-link').click()
  await page.getByTestId('category-processors').click()
  await expect(page).toHaveURL(/\/catalog\?category=processors$/)
  await expect(page.getByTestId('category-processors')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('product-card').first()).toBeVisible()

  const response = await page.reload()
  expect(response.status()).toBe(200)
  await expect(page.getByTestId('category-processors')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('product-card').first()).toBeVisible()
  for (const card of await page.getByTestId('product-card').all()) {
    await expect(card).toHaveAttribute('data-category', 'processors')
  }
})

test('неизвестный API endpoint возвращает JSON 404, а не SPA', async ({ request }) => {
  const response = await request.get('/api/nonexistent-smoke-endpoint')
  expect(response.status()).toBe(404)
  expect(response.headers()['content-type']).toContain('application/json')
  expect(await response.json()).toMatchObject({ statusCode: 404 })
})
