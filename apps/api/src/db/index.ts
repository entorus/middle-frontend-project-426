import { resolve } from 'node:path'

import knex from 'knex'

const connection = process.env.DATABASE_URL

if (!connection) {
  throw new Error('Переменная DATABASE_URL не задана')
}

export const db = knex({
  client: 'pg',
  connection,
  pool: { min: 0, max: 10 },
  migrations: {
    directory: resolve(__dirname, 'migrations'),
    loadExtensions: ['.js'],
  },
  seeds: {
    directory: resolve(__dirname, 'seeds'),
    loadExtensions: ['.js'],
  },
})
