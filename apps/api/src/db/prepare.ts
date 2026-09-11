import { db } from './index'

async function prepareDatabase(): Promise<void> {
  try {
    await db.migrate.latest()
    process.stdout.write('Миграции применены\n')
    await db.seed.run()
    process.stdout.write('Сид применён\n')
  } finally {
    await db.destroy()
  }
}

prepareDatabase().catch(() => {
  process.stderr.write('Не удалось применить миграции или сид\n')
  process.exitCode = 1
})
