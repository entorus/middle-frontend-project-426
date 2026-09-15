import { Link } from 'react-router-dom'

import { ProductImage } from './ProductImage'
import type { Product } from './types'
import { formatMoney } from '../shared/money'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className="product"
      data-testid="catalog-item"
      data-category={product.category_slug}
      data-product-id={product.id}
    >
      <ProductImage product={product} />
      <p className="eyebrow">{product.category_name}</p>
      <h3>
        <Link to={`/products/${product.id}`} data-testid="catalog-item-name">
          {product.name}
        </Link>
      </h3>
      <p className="description">{product.description}</p>
      <strong data-testid="catalog-item-price">{formatMoney(product.price.amount)}</strong>
      <p data-testid="catalog-item-availability" data-available={String(product.available)}>
        {product.available ? 'В наличии' : 'Нет в наличии'}
      </p>
    </article>
  )
}
