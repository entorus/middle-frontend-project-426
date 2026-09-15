import { Link } from 'react-router-dom'

import { ProductImage } from './ProductImage'
import type { Product } from './types'
import { formatMoney } from '../shared/money'
import { AddToCart } from '../cart'
import { Availability } from './Availability'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
      data-testid="catalog-item"
      data-category={product.category_slug}
      data-product-id={product.id}
    >
      <ProductImage product={product} />
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-medium text-gray-500">{product.category_name}</p>
        <h3 className="my-2 text-base font-semibold leading-6 text-gray-900">
          <Link to={`/products/${product.id}`} data-testid="catalog-item-name">
            {product.name}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-xs leading-5 text-gray-500">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <strong className="text-lg" data-testid="catalog-item-price">
            {formatMoney(product.price.amount)}
          </strong>
          <Availability available={product.available} testId="catalog-item-availability" />
        </div>
        <AddToCart product={product} catalog />
      </div>
    </article>
  )
}
