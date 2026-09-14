import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('orders', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('RESTRICT')
    table.string('status').notNullable().defaultTo('paid')
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(db.fn.now())
    table.string('method').notNullable()
    table.string('recipient_name', 100).notNullable()
    table.string('phone', 25).notNullable()
    table.string('address', 500).nullable()
    table.bigInteger('total_kopecks').notNullable()
    table.check("status = 'paid'")
    table.check("method IN ('delivery', 'pickup')")
    table.check(
      "(method = 'pickup' AND address IS NULL) OR (method = 'delivery' AND length(trim(address)) > 0 AND address IS NOT NULL)",
    )
    table.check('total_kopecks >= 0 AND total_kopecks <= 9007199254740991')
    table.index(['user_id', 'id'])
  })
  await db.schema.createTable('order_items', (table) => {
    table.increments('id').primary()
    table.integer('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE')
    // Historical identifier, deliberately not an FK: catalog deletion cannot alter a purchase.
    table.integer('product_id').notNullable()
    table.text('name').notNullable()
    table.integer('quantity').notNullable()
    table.bigInteger('price_kopecks').notNullable()
    table.check('quantity BETWEEN 1 AND 999')
    table.check('price_kopecks >= 0')
    table.unique(['order_id', 'product_id'])
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('order_items')
  await db.schema.dropTable('orders')
}
