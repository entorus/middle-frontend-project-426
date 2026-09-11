import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('products', (table) => {
    table.increments('id').primary()
    table.string('sku').notNullable().unique()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.integer('price_kopecks').notNullable()
    table
      .integer('category_id')
      .notNullable()
      .references('id')
      .inTable('categories')
      .onDelete('RESTRICT')
    table.index('category_id')
    table.check('price_kopecks >= 0')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('products')
}
