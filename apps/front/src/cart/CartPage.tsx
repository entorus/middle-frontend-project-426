import { Link } from 'react-router-dom'

import { Button, primaryLink } from '../shared/ui'
import { useCart } from './CartProvider'
import { useCartProducts } from './useCartProducts'
import { CartRow } from './CartRow'
import { formatMoney } from '../shared/money'

export function CartPage() {
  const { items, storageError } = useCart()
  const { products, refresh } = useCartProducts(items)
  const ready = items.every((item) => Boolean(products[item.id]))
  const valid =
    items.length > 0 && ready && items.every((item) => products[item.id]?.product?.available)
  const total = items.reduce((sum, item) => {
    const product = products[item.id]?.product
    return sum + (product?.available ? product.price.amount * item.quantity : 0)
  }, 0)
  return (
    <section className="space-y-5">
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
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
            <>
              <Button type="button" onClick={refresh}>
                Обновить цены и наличие
              </Button>
              <div className="mt-4 grid gap-3">
                {items.map((item) => (
                  <CartRow key={item.id} item={item} state={products[item.id]} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <p>
            Итого:{' '}
            <strong className="text-2xl font-bold" data-testid="cart-total">
              {ready ? formatMoney(total) : 'Проверяем цены…'}
            </strong>
          </p>
          {!valid && items.length > 0 && ready && (
            <p className="text-sm text-red-600" role="alert">
              Недоступные и непроверенные товары не включены в итог. Удалите их или обновите данные.
            </p>
          )}
          <p>
            Сумма справочная. Окончательная стоимость будет проверена сервером при оформлении
            заказа.
          </p>
          {valid ? (
            <Link className={primaryLink} to="/checkout" data-testid="cart-checkout">
              Перейти к оформлению
            </Link>
          ) : (
            <Button type="button" data-testid="cart-checkout" disabled>
              Перейти к оформлению
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
