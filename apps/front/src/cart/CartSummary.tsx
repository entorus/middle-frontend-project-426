import { Link } from 'react-router-dom'

import { Button, primaryLink } from '../shared/ui'
import { formatMoney } from '../shared/money'

type Props = {
  count: number
  total: number
  ready: boolean
  valid: boolean
}

export function CartSummary({ count, total, ready, valid }: Props) {
  return (
    <aside
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
      aria-labelledby="cart-summary-title"
      data-testid="cart-summary"
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 id="cart-summary-title" className="text-base font-semibold">
          Итог
        </h2>
      </div>
      <dl className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-base text-gray-500">Товаров</dt>
          <dd className="text-base tabular-nums" data-testid="cart-count">
            {count}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="shrink-0 text-base text-gray-500">К оплате</dt>
          <dd className="text-right text-xl font-bold tabular-nums" data-testid="cart-total">
            {ready ? formatMoney(total) : 'Проверяем цены…'}
          </dd>
        </div>
      </dl>
      {!valid && count > 0 && ready && (
        <p className="text-sm text-red-600" role="alert">
          Недоступные и непроверенные товары не включены в итог. Удалите их или перезагрузите
          страницу.
        </p>
      )}
      {valid ? (
        <Link className={`${primaryLink} w-full`} to="/checkout" data-testid="cart-checkout">
          Оформить заказ
        </Link>
      ) : (
        <Button variant="primary" className="w-full" data-testid="cart-checkout" disabled>
          Оформить заказ
        </Button>
      )}
      <p className="text-xs leading-relaxed text-gray-500">
        Окончательную сумму посчитает сервер по актуальным ценам.
      </p>
    </aside>
  )
}
