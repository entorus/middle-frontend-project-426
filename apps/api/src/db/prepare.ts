import { db } from './index';

async function prepareDatabase(): Promise<void> {
  try {
    await db.migrate.latest();
    await db.seed.run();
  } finally {
    await db.destroy();
  }
}

prepareDatabase().catch(() => {
  process.stderr.write('Не удалось применить миграции или сид\n');
  process.exitCode = 1;
});