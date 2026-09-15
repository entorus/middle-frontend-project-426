import type { FastifyInstance } from 'fastify'
import type { Knex } from 'knex'

import { selectProducts, toProduct } from './catalog/products'
import type { ProductRow } from './catalog/products'
import { routeSchemas } from './generated/schemas'
import type { components } from './generated/api'

export function registerPromotions(app: FastifyInstance, db: Knex) {
  app.get('/api/promotions', { schema: routeSchemas.listPromotions }, async () => {
    type Row = ProductRow & { promo_id: number; title: string; text: string }
    const rows: Row[] = await selectProducts(db)
      .join('promotions', 'promotions.product_id', 'products.id')
      .select('promotions.id as promo_id', 'promotions.title', 'promotions.text')
      .where('products.available', true)
      .orderBy('promotions.position')
      .orderBy('promotions.id')
    return rows.map(
      ({ promo_id, title, text, ...product }): components['schemas']['Promotion'] => ({
        id: promo_id,
        title,
        text,
        product: toProduct(product),
      }),
    )
  })
}
