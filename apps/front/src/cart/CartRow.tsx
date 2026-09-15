import { Link } from 'react-router-dom'

import { useCart } from './CartProvider'
import { Quantity } from './Quantity'
import type { CartItem } from './storage'
import type { ProductState } from './useCartProducts'
import { formatMoney } from '../shared/money'

export function CartRow({ item, state }: { item: CartItem; state?: ProductState }) {
  const { remove } = useCart()
  const product = state?.product
  return (
    <article className="cart-row" data-testid="cart-item" data-product-id={item.id}>
      <div>
        {product ? (
          <>
            <h2>
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h2>
            <p data-testid="cart-item-price">{formatMoney(product.price.amount)} за шт.</p>
            {!product.available && (
              <p role="alert">Больше нет в наличии. Удалите товар, чтобы продолжить.</p>
            )}
          </>
        ) : (
          <p role={state?.error ? 'alert' : 'status'}>{state?.error ?? 'Загружаем товар…'}</p>
        )}
      </div>
      <Quantity item={item} />
      <button
        type="button"
        data-testid="cart-item-remove"
        onClick={() => remove(item.id)}
        aria-label={product ? `Удалить ${product.name}` : 'Удалить позицию'}
      >
        Удалить
      </button>
    </article>
  )
}
