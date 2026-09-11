import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('categories', (table) => {
    table.increments('id').primary()
    table.string('slug').notNullable().unique()
    table.string('name').notNullable()
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('categories')
}
