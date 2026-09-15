import { Link } from 'react-router-dom'

import { ProductImage } from '../catalog/ProductImage'
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
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-[96px_minmax(0,1fr)_90px_auto_auto]"
      data-testid="cart-item"
      data-product-id={item.id}
    >
      {product ? (
        <Link to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true">
          <ProductImage product={product} compact />
        </Link>
      ) : (
        <div className="size-24 bg-gray-100" aria-hidden="true" />
      )}
      <div className="col-span-2 min-w-0 sm:col-span-1">
        {product ? (
          <>
            <h2 className="mb-1 text-base font-semibold leading-6 text-gray-900">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h2>
            <p className="text-sm text-gray-500" data-testid="cart-item-price">
              {formatMoney(product.price.amount)} за штуку
            </p>
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
      <strong className="text-right text-base tabular-nums" data-testid="cart-item-total">
        {product?.available ? formatMoney(product.price.amount * item.quantity) : '—'}
      </strong>
      <button
        className="cursor-pointer rounded px-1 py-2 text-sm font-semibold text-red-600 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
