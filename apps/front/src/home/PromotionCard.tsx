import { Link } from 'react-router-dom'

import type { components } from '../generated/api'
import { formatMoney } from '../shared/money'
import { ProductImage } from '../catalog/ProductImage'

export function PromotionCard({ promo }: { promo: components['schemas']['Promotion'] }) {
  return (
    <Link
      to={`/products/${promo.product.id}`}
      data-testid="home-promo-item"
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-500"
    >
      <ProductImage product={promo.product} />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-gray-500">{promo.product.category_name}</p>
        <h3 className="my-2 text-base font-semibold leading-6 text-gray-900">{promo.title}</h3>
        <p className="mb-4 text-sm leading-6 text-gray-500">{promo.text}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm">
          <span>{promo.product.name}</span>
          <strong>{formatMoney(promo.product.price.amount)}</strong>
        </div>
        <span className="mt-4 block rounded-md bg-indigo-100 px-3 py-2 text-center text-sm font-semibold text-indigo-700 group-hover:bg-indigo-200">
          Посмотреть товар <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  )
}
