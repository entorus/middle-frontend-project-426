import { Link, useParams } from 'react-router-dom'

import { useResource } from '../useResource'
import { AddToCart } from '../cart'
import { ProductImage } from './ProductImage'
import type { Product } from './types'
import { formatMoney } from '../shared/money'
import { Availability } from './Availability'

export function ProductDetail() {
  const { id } = useParams()
  const { data, error } = useResource<Product>(`/api/products/${encodeURIComponent(id ?? '')}`)
  return (
    <section className="space-y-5">
      <Link to="/catalog" className="text-sm text-gray-500 hover:text-indigo-600">
        ← В каталог
      </Link>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!data && !error && (
        <p className="py-2 text-sm text-gray-500" role="status">
          Загрузка…
        </p>
      )}
      {data && (
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <ProductImage key={data.id} product={data} large />
          </div>
          <div className="space-y-4">
            <h1
              className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl"
              data-testid="product-name"
            >
              {data.name}
            </h1>
            <Availability available={data.available} />
            <p className="leading-6 text-gray-600" data-testid="product-description">
              {data.description}
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <strong className="text-3xl font-bold" data-testid="product-price">
                {formatMoney(data.price.amount)}
              </strong>
              <AddToCart key={data.id} product={data} />
            </div>
            <ul className="list-inside list-disc space-y-1 border-t border-gray-200 pt-4 text-xs text-gray-500">
              <li>Цена указана в рублях</li>
              <li>Доставка по городу или самовывоз</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
