import { Link } from 'react-router-dom'

import type { components } from '../generated/api'
import { formatMoney } from '../shared/money'

export function PromotionCard({ promo }: { promo: components['schemas']['Promotion'] }) {
  return (
    <Link
      to={`/products/${promo.product.id}`}
      data-testid="home-promo-item"
      className="home-promo-card"
    >
      <p className="eyebrow">{promo.product.category_name}</p>
      <h3>{promo.title}</h3>
      <p className="promo-text">{promo.text}</p>
      <div className="promo-product">
        <span>{promo.product.name}</span>
        <strong>{formatMoney(promo.product.price.amount)}</strong>
      </div>
      <span className="promo-action">
        Посмотреть товар <span aria-hidden="true">↗</span>
      </span>
    </Link>
  )
}
