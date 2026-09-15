import { Link, useParams } from 'react-router-dom'

import { Button } from '../shared/ui'
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
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
        <Button type="button" onClick={retry}>
          Повторить
        </Button>
        <Link to="/account">Мои заказы</Link>
      </section>
    )
  if (!data)
    return (
      <p className="py-2 text-sm text-gray-500" role="status">
        Загружаем заказ…
      </p>
    )
  return (
    <section
      className="mx-auto max-w-3xl space-y-4 rounded-xl border border-emerald-200 bg-white p-6"
      data-testid="order-success"
    >
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Заказ №{data.id} оформлен
      </h1>
      {storageError && (
        <p className="text-sm text-red-600" role="alert">
          {storageError}
        </p>
      )}
      <OrderDetails order={data} />
      <Link to="/account">Мои заказы</Link>
    </section>
  )
}
