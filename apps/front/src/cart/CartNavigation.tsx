import { Link } from 'react-router-dom'

import { useCart } from './CartProvider'

export function CartNavigation() {
  const { items } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Link to="/cart" data-testid="nav-cart">
      Корзина
      {count > 0 && (
        <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
