import { Link, useParams } from 'react-router-dom'

import { useResource } from '../useResource'
import { AddToCart } from '../cart'
import { ProductImage } from './ProductImage'
import type { Product } from './types'
import { formatMoney } from '../shared/money'

export function ProductDetail() {
  const { id } = useParams()
  const { data, error } = useResource<Product>(`/api/products/${encodeURIComponent(id ?? '')}`)
  return (
    <section className="product-detail">
      <Link to="/catalog">← В каталог</Link>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Загрузка…</p>}
      {data && (
        <>
          <h1 data-testid="product-name">{data.name}</h1>
          <ProductImage key={data.id} product={data} />
          <p data-testid="product-description">{data.description}</p>
          <strong data-testid="product-price">{formatMoney(data.price.amount)}</strong>
          <p>{data.available ? 'В наличии' : 'Нет в наличии'}</p>
          <AddToCart key={data.id} product={data} />
        </>
      )}
    </section>
  )
}
