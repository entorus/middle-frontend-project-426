import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email', 254).notNullable().unique()
    table.text('password_hash').notNullable()
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(db.fn.now())
    table.check('email = lower(email)')
  })
  await db.schema.createTable('sessions', (table) => {
    table.string('token_hash', 64).primary()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.timestamp('expires_at', { useTz: true }).notNullable().index()
    table.index('user_id')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('sessions')
  await db.schema.dropTable('users')
}
