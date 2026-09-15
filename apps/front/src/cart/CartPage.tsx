import { Link } from 'react-router-dom'

import { useCart } from './CartProvider'
import { useCartProducts } from './useCartProducts'
import { CartRow } from './CartRow'
import { CartSummary } from './CartSummary'

export function CartPage() {
  const { items, storageError } = useCart()
  const { products } = useCartProducts(items)
  const ready = items.every((item) => Boolean(products[item.id]))
  const valid =
    items.length > 0 && ready && items.every((item) => products[item.id]?.product?.available)
  const total = items.reduce((sum, item) => {
    const product = products[item.id]?.product
    return sum + (product?.available ? product.price.amount * item.quantity : 0)
  }, 0)
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Корзина
      </h1>
      {storageError && (
        <p className="text-sm text-red-600" role="alert">
          {storageError}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="min-w-0">
          {items.length === 0 ? (
            <div
              className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
              data-testid="cart-empty"
            >
              <p>Ваша корзина пока пуста.</p>
              <Link to="/catalog">Выбрать комплектующие ↗</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((item) => (
                <CartRow key={item.id} item={item} state={products[item.id]} />
              ))}
            </div>
          )}
        </div>
        <CartSummary
          count={items.reduce((sum, item) => sum + item.quantity, 0)}
          total={total}
          ready={ready}
          valid={valid}
        />
      </div>
    </section>
  )
}
