import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('promotions', (table) => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.text('text').notNullable()
    table
      .integer('product_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')
    table.integer('position').notNullable().defaultTo(0)
    table.check('length(trim(title)) > 0')
    table.check('length(trim(text)) > 0')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('promotions')
}
