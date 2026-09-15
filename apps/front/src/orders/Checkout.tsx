import { Navigate } from 'react-router-dom'

import { useCheckout } from './useCheckout'
import { CheckoutForm } from './CheckoutForm'
import { OrderError } from './OrderError'

export function Checkout() {
  const checkout = useCheckout()
  const { items, createdId, error, problems } = checkout
  if (createdId !== null) return <Navigate to={`/orders/${createdId}/success`} replace />
  if (items.length === 0) return <Navigate to="/cart" replace />
  return (
    <section className="mx-auto w-full max-w-xl space-y-5">
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Оформление заказа
      </h1>
      <p>
        В корзине {items.reduce((sum, item) => sum + item.quantity, 0)} шт. Цены и итог проверит
        сервер.
      </p>
      <CheckoutForm {...checkout} />
      {error && <OrderError error={error} problems={problems} />}
    </section>
  )
}
