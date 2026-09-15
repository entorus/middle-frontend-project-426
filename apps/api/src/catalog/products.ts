import type { Knex } from 'knex'

import type { components } from '../generated/api'

type Product = components['schemas']['Product']
export type ProductRow = Omit<Product, 'price'> & { price_kopecks: number }
export const toProduct = ({ price_kopecks, ...product }: ProductRow): Product => ({
  ...product,
  price: { amount: price_kopecks, currency: 'RUB' },
})

export const selectProducts = (db: Knex) =>
  db('products')
    .join('categories', 'categories.id', 'products.category_id')
    .select(
      'products.id',
      'products.sku',
      'products.name',
      'products.description',
      'products.price_kopecks',
      'products.image_url',
      'products.available',
      'categories.slug as category_slug',
      'categories.name as category_name',
    )
