import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('products', (table) => {
    table.text('image_url').nullable()
    table.boolean('available').notNullable().defaultTo(true)
    table.index(['category_id', 'price_kopecks'])
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('products', (table) => {
    table.dropIndex(['category_id', 'price_kopecks'])
    table.dropColumn('image_url')
    table.dropColumn('available')
  })
}
