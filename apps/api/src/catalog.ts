import type { FastifyInstance } from 'fastify'
import type { Knex } from 'knex'

import { HttpError } from './contract'
import { routeSchemas } from './generated/schemas'
import type { operations } from './generated/api'
import { selectProducts, toProduct } from './catalog/products'
import type { ProductRow } from './catalog/products'

export { selectProducts, toProduct }
export type { ProductRow }
type Query = NonNullable<operations['listProducts']['parameters']['query']>

export function registerCatalog(app: FastifyInstance, db: Knex) {
  app.get<{ Querystring: Query }>(
    '/api/products',
    { schema: routeSchemas.listProducts },
    async ({ query }) => {
      const { category, priceMin, priceMax, available, search, page = 1, pageSize = 12 } = query
      if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax)
        throw new HttpError(400, 'Минимальная цена не может быть больше максимальной')
      if (category && !(await db('categories').where('slug', category).first()))
        throw new HttpError(404, 'Категория не найдена')
      const filtered = selectProducts(db)
      if (category) filtered.where('categories.slug', category)
      if (priceMin !== undefined) filtered.where('price_kopecks', '>=', priceMin * 100)
      if (priceMax !== undefined) filtered.where('price_kopecks', '<=', priceMax * 100)
      if (available !== undefined) filtered.where('available', available)
      if (search) filtered.whereRaw('strpos(lower(products.name), lower(?)) > 0', [search.trim()])
      const count = await filtered
        .clone()
        .clearSelect()
        .count<{ total: string }>({ total: '*' })
        .first()
      const total = Number(count?.total ?? 0)
      const rows: ProductRow[] = await filtered
        .orderBy('products.id')
        .limit(pageSize)
        .offset((page - 1) * pageSize)
      return {
        items: rows.map(toProduct),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    },
  )

  app.get<{ Params: { id: number } }>(
    '/api/products/:id',
    { schema: routeSchemas.getProduct },
    async ({ params }) => {
      const product: ProductRow | undefined = await selectProducts(db)
        .where('products.id', params.id)
        .first()
      if (!product) throw new HttpError(404, 'Товар не найден')
      return toProduct(product)
    },
  )
}
