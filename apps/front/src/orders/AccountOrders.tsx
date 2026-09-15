import { Button } from '../shared/ui'
import { useAuth } from '../auth'
import { useResource } from '../useResource'
import { OrderDetails } from './OrderDetails'
import type { components } from '../generated/api'

type Order = components['schemas']['Order']

export function AccountOrders() {
  const { user } = useAuth()
  const { data, error, retry } = useResource<Order[]>('/api/orders')
  return (
    <section data-testid="account-page">
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Личный кабинет
      </h1>
      <p className="mb-6 text-gray-500" data-testid="account-email">
        {user?.email}
      </p>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
          <Button type="button" onClick={retry}>
            Повторить
          </Button>
        </p>
      )}
      {!data && !error && (
        <p className="py-2 text-sm text-gray-500" role="status">
          Загружаем заказы…
        </p>
      )}
      <div data-testid="account-orders">
        {data?.length === 0 && <p data-testid="account-orders-empty">У вас пока нет заказов.</p>}
        {data?.map((order) => (
          <article
            key={order.id}
            data-testid="account-order-item"
            className="my-4 space-y-3 rounded-xl border border-gray-200 bg-white p-5"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Заказ №{order.id}</h2>
            <OrderDetails order={order} />
          </article>
        ))}
      </div>
    </section>
  )
}
