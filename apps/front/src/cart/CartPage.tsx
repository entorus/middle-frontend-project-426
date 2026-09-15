import { Link } from 'react-router-dom'

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
    <section className="cart-page">
      <h1>Корзина</h1>
      {storageError && <p role="alert">{storageError}</p>}
      {items.length === 0 ? (
        <div data-testid="cart-empty">
          <p>Ваша корзина пока пуста.</p>
          <Link to="/catalog">Выбрать комплектующие ↗</Link>
        </div>
      ) : (
        <>
          <button type="button" onClick={refresh}>
            Обновить цены и наличие
          </button>
          <div className="cart-items">
            {items.map((item) => (
              <CartRow key={item.id} item={item} state={products[item.id]} />
            ))}
          </div>
        </>
      )}
      <div className="cart-summary">
        <p>
          Итого:{' '}
          <strong data-testid="cart-total">{ready ? formatMoney(total) : 'Проверяем цены…'}</strong>
        </p>
        {!valid && items.length > 0 && ready && (
          <p role="alert">
            Недоступные и непроверенные товары не включены в итог. Удалите их или обновите данные.
          </p>
        )}
        <p>
          Сумма справочная. Окончательная стоимость будет проверена сервером при оформлении заказа.
        </p>
        {valid ? (
          <Link className="home-catalog-link" to="/checkout" data-testid="cart-checkout">
            Перейти к оформлению
          </Link>
        ) : (
          <button type="button" data-testid="cart-checkout" disabled>
            Перейти к оформлению
          </button>
        )}
      </div>
    </section>
  )
}
