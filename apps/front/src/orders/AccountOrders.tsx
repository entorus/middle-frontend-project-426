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
      <h1>Личный кабинет</h1>
      <p data-testid="account-email">{user?.email}</p>
      {error && (
        <p role="alert">
          {error}
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </p>
      )}
      {!data && !error && <p role="status">Загружаем заказы…</p>}
      <div data-testid="account-orders">
        {data?.length === 0 && <p data-testid="account-orders-empty">У вас пока нет заказов.</p>}
        {data?.map((order) => (
          <article key={order.id} data-testid="account-order-item" className="account-order">
            <h2>Заказ №{order.id}</h2>
            <OrderDetails order={order} />
          </article>
        ))}
      </div>
    </section>
  )
}
