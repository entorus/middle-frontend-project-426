import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000'
const parsedURL = new URL(baseURL)
if (!['http:', 'https:'].includes(parsedURL.protocol)) {
  throw new Error('BASE_URL должен быть HTTP(S)-адресом приложения')
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30000,
  expect: { timeout: 10000 },
  globalSetup: './tests/e2e/global-setup.mjs',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
