import { randomUUID } from 'node:crypto'

import { test, expect } from '@playwright/test'

const credentials = () => ({
  email: `auth-${randomUUID()}@example.com`,
  password: 'Test-password-2026',
})

async function fillForm(page, account) {
  await page.getByTestId('auth-email').fill(account.email)
  await page.getByTestId('auth-password').fill(account.password)
  await page.getByTestId('auth-submit').click()
}

async function register(request, account) {
  const response = await request.post('/api/auth/signup', { data: account })
  expect(response.status()).toBe(200)
  expect(await response.json()).toEqual({ id: expect.any(Number), email: account.email })
}

test('регистрация авторизует нового пользователя', async ({ page }) => {
  const account = credentials()
  await page.goto('/')
  await page.getByTestId('nav-signup').click()
  await fillForm(page, account)
  await expect(page.getByTestId('account-email')).toHaveText(account.email)
  await expect(page.getByTestId('nav-account')).toBeVisible()
  await expect(page.getByTestId('nav-signout')).toBeVisible()
  await expect(page.getByTestId('nav-signup')).toHaveCount(0)
  await expect(page.getByTestId('nav-signin')).toHaveCount(0)
})

test('существующий пользователь входит по email и паролю', async ({ page, request }) => {
  const account = credentials()
  await register(request, account)
  await page.goto('/')
  await page.getByTestId('nav-signin').click()
  await fillForm(page, { ...account, email: account.email.toUpperCase() })
  await expect(page.getByTestId('account-email')).toHaveText(account.email)
})

test('выход отзывает cookie на сервере и закрывает кабинет', async ({ page, context, request }) => {
  const account = credentials()
  await page.goto('/signup')
  await fillForm(page, account)
  await expect(page.getByTestId('account-page')).toBeVisible()
  const cookie = (await context.cookies()).find((item) => item.name === 'psparts_session')
  expect(cookie.httpOnly).toBe(true)
  expect(cookie.sameSite).toBe('Lax')
  await page.getByTestId('nav-signout').click()
  await expect(page).toHaveURL(/\/signin$/)
  const response = await request.get('/api/auth/me', {
    headers: { Cookie: `${cookie.name}=${cookie.value}` },
  })
  expect(response.status()).toBe(401)
  await page.goto('/account')
  await expect(page).toHaveURL(/\/signin$/)
  await expect(page.getByTestId('account-page')).toHaveCount(0)
  await expect(page.getByTestId('nav-account')).toHaveCount(0)
})

test('занятый email отклоняется независимо от регистра', async ({ page, request }) => {
  const account = credentials()
  await register(request, account)
  await page.goto('/signup')
  await fillForm(page, { ...account, email: account.email.toUpperCase() })
  await expect(page.getByTestId('auth-error')).toContainText('Этот email уже зарегистрирован')
  await expect(page.getByTestId('nav-signin')).toBeVisible()
})

test('неверный пароль отклоняется', async ({ page, request }) => {
  const account = credentials()
  await register(request, account)
  await page.goto('/signin')
  await fillForm(page, { ...account, password: 'wrong-password' })
  await expect(page.getByTestId('auth-error')).toContainText('Неверный email или пароль')
  await expect(page.getByTestId('nav-account')).toHaveCount(0)
})

test('сессия сохраняется после перезагрузки', async ({ page, context }) => {
  const account = credentials()
  await page.goto('/signup')
  await fillForm(page, account)
  await expect(page.getByTestId('account-email')).toHaveText(account.email)
  const cookie = (await context.cookies()).find((item) => item.name === 'psparts_session')
  expect(cookie).toBeDefined()
  expect(cookie.secure).toBe(new URL(page.url()).protocol === 'https:')
  await page.reload()
  await expect(page.getByTestId('account-email')).toHaveText(account.email)
  await expect(page.getByTestId('nav-signout')).toBeVisible()
})

test('гость не открывает кабинет по прямому адресу', async ({ page }) => {
  await page.goto('/account')
  await expect(page).toHaveURL(/\/signin$/)
  await expect(page.getByTestId('account-page')).toHaveCount(0)
  await expect(page.getByTestId('nav-signin')).toBeVisible()
})

test('API валидирует форму и отклоняет cross-site запросы', async ({ request }) => {
  for (const data of [
    { email: '', password: 'password123' },
    { email: 'not-email', password: 'password123' },
    { email: 'valid@example.com', password: 'short' },
  ]) {
    const response = await request.post('/api/auth/signup', { data })
    expect(response.status()).toBe(400)
    expect(await response.json()).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      message: expect.any(String),
    })
  }
  const response = await request.post('/api/auth/signout', {
    headers: { Origin: 'https://evil.example' },
  })
  expect(response.status()).toBe(400)
})
