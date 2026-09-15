import { test, expect } from '@playwright/test'

test('единая иллюстрация показывает название, категорию и разные цвета', async ({
  page,
  request,
}) => {
  const asset = await request.get('/images/product-chip.svg')
  expect(asset.status()).toBe(200)
  expect(asset.headers()['content-type']).toContain('image/svg+xml')
  expect(await asset.text()).toContain('id="chip"')

  const backgrounds = []
  for (const category of ['processors', 'graphics-cards', 'memory']) {
    const response = await request.get(`/api/products?category=${category}`)
    const { items } = await response.json()
    const product = items[0]
    await page.goto(`/products/${product.id}`)
    const illustration = page.getByTestId('product-illustration')
    await expect(illustration).toBeVisible()
    await expect(illustration).toHaveAccessibleName(`${product.name} — ${product.category_name}`)
    await expect(illustration).toContainText(product.name)
    await expect(illustration).toContainText(product.category_name)
    await expect(illustration.locator('use')).toHaveAttribute(
      'href',
      '/images/product-chip.svg#chip',
    )
    backgrounds.push(
      await illustration.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
  }
  expect(new Set(backgrounds).size).toBe(3)
})
