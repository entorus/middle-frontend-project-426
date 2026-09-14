import { useState } from 'react'
import type { ReactNode, SubmitEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { useAuth } from './auth'
import { useCart } from './cart'
import { useResource } from './useResource'
import type { components } from './generated/api'

type Order = components['schemas']['Order']
type CreateOrder = components['schemas']['CreateOrder']
const rubles = (amount: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount / 100)

export function RequireAuth({
  children,
  checkout = false,
}: {
  children: ReactNode
  checkout?: boolean
}) {
  const { user, loading, error } = useAuth()
  if (loading) return <p role="status">Проверяем вход…</p>
  if (error) return <p role="alert">{error}</p>
  if (!user) return <Navigate to={checkout ? '/signin?next=checkout' : '/signin'} replace />
  return children
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <>
      <p data-testid="order-status" data-status={order.status}>
        Оплачен
      </p>
      <p>
        Дата:{' '}
        <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('ru-RU')}</time>
      </p>
      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.productId}>
            <strong>{item.name}</strong> — {item.quantity} шт. × {rubles(item.price.amount)} ={' '}
            {rubles(item.total.amount)}
          </li>
        ))}
      </ul>
      <p>
        Итого: <strong data-testid="order-total">{rubles(order.total.amount)}</strong>
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

export function Checkout() {
  const { items, clear } = useCart()
  const { setUser } = useAuth()
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pending, setPending] = useState(false)
  const [createdId, setCreatedId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [problems, setProblems] = useState<components['schemas']['ProblemProduct'][]>([])
  if (createdId !== null) return <Navigate to={`/orders/${createdId}/success`} replace />
  if (items.length === 0) return <Navigate to="/cart" replace />
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || items.length === 0) return
    setPending(true)
    setError('')
    setProblems([])
    const receiving: CreateOrder['receiving'] =
      method === 'delivery' ? { method, name, phone, address } : { method, name, phone }
    const payload: CreateOrder = {
      items: items.map(({ id, quantity }) => ({ id, quantity })),
      receiving,
    }
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        setUser(null)
        return
      }
      if (!response.ok) {
        const body = (await response.json()) as components['schemas']['ApiError'] & {
          products?: components['schemas']['ProblemProduct'][]
        }
        setError(body.message)
        setProblems(body.products ?? [])
        return
      }
      const order = (await response.json()) as Order
      setCreatedId(order.id)
      clear()
    } catch {
      setError(
        'Не удалось получить подтверждение. Проверьте историю заказов перед повторной отправкой.',
      )
    } finally {
      setPending(false)
    }
  }
  return (
    <section className="checkout-page">
      <h1>Оформление заказа</h1>
      <p>
        В корзине {items.reduce((sum, item) => sum + item.quantity, 0)} шт. Цены и итог проверит
        сервер.
      </p>
      <form data-testid="checkout-form" onSubmit={(event) => void submit(event)}>
        <fieldset disabled={pending}>
          <label htmlFor="checkout-method">Способ получения</label>
          <select
            id="checkout-method"
            data-testid="checkout-method"
            value={method}
            onChange={(event) => setMethod(event.target.value as 'delivery' | 'pickup')}
          >
            <option value="delivery">Доставка</option>
            <option value="pickup">Самовывоз</option>
          </select>
          <label htmlFor="checkout-name">Имя получателя</label>
          <input
            id="checkout-name"
            data-testid="checkout-name"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor="checkout-phone">Телефон</label>
          <input
            id="checkout-phone"
            data-testid="checkout-phone"
            type="tel"
            autoComplete="tel"
            required
            minLength={7}
            maxLength={25}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {method === 'delivery' ? (
            <>
              <label htmlFor="checkout-address">Адрес доставки</label>
              <input
                id="checkout-address"
                data-testid="checkout-address"
                autoComplete="street-address"
                required
                maxLength={500}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </>
          ) : (
            <p>Самовывоз из единственного пункта выдачи магазина. Адрес доставки не нужен.</p>
          )}
          <button type="submit" data-testid="checkout-submit">
            {pending ? 'Оформляем…' : 'Оформить заказ'}
          </button>
        </fieldset>
      </form>
      {error && (
        <div role="alert" data-testid="order-error">
          <p>{error}</p>
          {problems.length > 0 && (
            <ul>
              {problems.map((product) => (
                <li key={product.id}>
                  Товар №{product.id}:{' '}
                  {product.reason === 'not_found' ? 'не найден в каталоге' : 'нет в наличии'}
                </li>
              ))}
            </ul>
          )}
          <Link to="/cart">Вернуться в корзину</Link> · <Link to="/account">Проверить заказы</Link>
        </div>
      )}
    </section>
  )
}

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
