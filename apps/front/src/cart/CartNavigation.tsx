import { Link } from 'react-router-dom'

import { useCart } from './CartProvider'

export function CartNavigation() {
  const { items } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Link to="/cart" data-testid="nav-cart">
      Корзина{count > 0 && <span className="cart-badge">{count}</span>}
    </Link>
  )
}
