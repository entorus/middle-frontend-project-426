import { Link } from 'react-router-dom'

import { Button } from '../shared/ui'
import { useCart } from './CartProvider'
import { Quantity } from './Quantity'
import type { CartItem } from './storage'
import type { ProductState } from './useCartProducts'
import { formatMoney } from '../shared/money'

export function CartRow({ item, state }: { item: CartItem; state?: ProductState }) {
  const { remove } = useCart()
  const product = state?.product
  return (
    <article
      className="grid items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_110px_auto]"
      data-testid="cart-item"
      data-product-id={item.id}
    >
      <div>
        {product ? (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h2>
            <p data-testid="cart-item-price">{formatMoney(product.price.amount)} за шт.</p>
            {!product.available && (
              <p className="text-sm text-red-600" role="alert">
                Больше нет в наличии. Удалите товар, чтобы продолжить.
              </p>
            )}
          </>
        ) : (
          <p role={state?.error ? 'alert' : 'status'}>{state?.error ?? 'Загружаем товар…'}</p>
        )}
      </div>
      <Quantity item={item} />
      <Button
        className="text-red-600"
        type="button"
        data-testid="cart-item-remove"
        onClick={() => remove(item.id)}
        aria-label={product ? `Удалить ${product.name}` : 'Удалить позицию'}
      >
        Удалить
      </Button>
    </article>
  )
}
