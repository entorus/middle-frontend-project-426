import { Link, useParams } from 'react-router-dom'

import { useCart } from '../cart'
import { useResource } from '../useResource'
import { OrderDetails } from './OrderDetails'
import type { components } from '../generated/api'

type Order = components['schemas']['Order']

export function OrderSuccess() {
  const { id } = useParams()
  const { data, error, retry } = useResource<Order>(`/api/orders/${encodeURIComponent(id ?? '')}`)
  const { storageError } = useCart()
  if (error)
    return (
      <section>
        <p role="alert">{error}</p>
        <button type="button" onClick={retry}>
          Повторить
        </button>
        <Link to="/account">Мои заказы</Link>
      </section>
    )
  if (!data) return <p role="status">Загружаем заказ…</p>
  return (
    <section data-testid="order-success">
      <h1>Заказ №{data.id} оформлен</h1>
      {storageError && <p role="alert">{storageError}</p>}
      <OrderDetails order={data} />
      <Link to="/account">Мои заказы</Link>
    </section>
  )
}
