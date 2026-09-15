import type { components } from '../generated/api'
import { formatMoney } from '../shared/money'

type Order = components['schemas']['Order']

export function OrderDetails({ order }: { order: Order }) {
  return (
    <>
      <p
        className="inline-flex rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
        data-testid="order-status"
        data-status={order.status}
      >
        Оплачен
      </p>
      <p>
        Дата:{' '}
        <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('ru-RU')}</time>
      </p>
      <ul className="my-4 divide-y divide-gray-100 text-sm">
        {order.items.map((item) => (
          <li className="py-3" key={item.productId}>
            <strong>{item.name}</strong> — {item.quantity} шт. × {formatMoney(item.price.amount)} ={' '}
            {formatMoney(item.total.amount)}
          </li>
        ))}
      </ul>
      <p>
        Итого:{' '}
        <strong className="text-xl" data-testid="order-total">
          {formatMoney(order.total.amount)}
        </strong>
      </p>
      <p>
        {order.receiving.method === 'delivery'
          ? `Доставка: ${order.receiving.address}`
          : 'Самовывоз из пункта выдачи магазина'}
      </p>
      <p>
        {order.receiving.name}, {order.receiving.phone}
      </p>
    </>
  )
}
