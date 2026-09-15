import { test, expect } from '@playwright/test'

test('health-check Хекслета доступен без авторизации', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  expect(await response.json()).toEqual({ health: 'check' })
})

test('SPA fallback поддерживает прямые пути с точкой, но не API и отсутствующие ресурсы', async ({
  request,
}) => {
  for (const path of ['/cart', '/account', '/unknown.page']) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/html')
    expect(await response.text()).toContain('id="root"')
  }
  for (const path of ['/api/missing', '/assets/missing.js', '/images/missing.svg']) {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
    expect(response.headers()['content-type']).toContain('application/json')
  }
})

test('каталог открывается и показывает товары из базы', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  const response = await page.goto('/catalog')
  expect(response.status()).toBe(200)
  await expect(page.getByTestId('app-title')).toBeVisible()
  await expect(page.getByTestId('catalog')).toBeVisible()
  await expect(page.getByTestId('catalog-item').first()).toBeVisible()
  await expect(page.getByTestId('catalog-error')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('клиентский маршрут и фильтр сохраняются после перезагрузки', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-catalog').click()
  await page.getByTestId('filter-category').selectOption('processors')
  await expect(page).toHaveURL(/\/catalog\?category=processors$/)
  await expect(page.getByTestId('filter-category')).toHaveValue('processors')
  await expect(page.getByTestId('catalog-item').first()).toBeVisible()

  const response = await page.reload()
  expect(response.status()).toBe(200)
  await expect(page.getByTestId('filter-category')).toHaveValue('processors')
  await expect(page.getByTestId('catalog-item').first()).toBeVisible()
  for (const card of await page.getByTestId('catalog-item').all()) {
    await expect(card).toHaveAttribute('data-category', 'processors')
  }
})

test('неизвестный API endpoint возвращает JSON 404, а не SPA', async ({ request }) => {
  const response = await request.get('/api/nonexistent-smoke-endpoint')
  expect(response.status()).toBe(404)
  expect(response.headers()['content-type']).toContain('application/json')
  expect(await response.json()).toMatchObject({ statusCode: 404 })
})
