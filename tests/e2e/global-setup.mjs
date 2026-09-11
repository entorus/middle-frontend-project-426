import { expect, request } from '@playwright/test'

export default async function globalSetup(config) {
  const context = await request.newContext({ baseURL: config.projects[0].use.baseURL })
  try {
    await expect
      .poll(
        async () => {
          try {
            const response = await context.get('/health-check', { timeout: 3000 })
            if (!response.ok() || !response.headers()['content-type']?.includes('application/json'))
              return false
            const body = await response.json()
            return body.health === 'check'
          } catch {
            return false
          }
        },
        {
          timeout: 60000,
          intervals: [500, 1000, 2000],
          message: 'Приложение не готово: /health-check должен вернуть JSON { health: "check" }',
        },
      )
      .toBe(true)
  } finally {
    await context.dispose()
  }
}
