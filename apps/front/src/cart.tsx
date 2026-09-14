import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'

import type { components } from './generated/api'

type Product = components['schemas']['Product']
type CartItem = { id: number; quantity: number }
const storageKey = 'psparts-cart'
const maxQuantity = 999
const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function readCart(): CartItem[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(data)) return []
    const quantities = new Map<number, number>()
    for (const item of data) {
      if (
        !item ||
        !Number.isSafeInteger(item.id) ||
        item.id < 1 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      )
        continue
      quantities.set(item.id, Math.min(maxQuantity, (quantities.get(item.id) ?? 0) + item.quantity))
    }
    return [...quantities].map(([id, quantity]) => ({ id, quantity }))
  } catch {
    return []
  }
}

type CartState = {
  items: CartItem[]
  storageError: string
  add: (id: number) => Promise<void>
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
}
const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)
  const [storageError, setStorageError] = useState('')
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
      setStorageError('')
    } catch {
      setStorageError(
        'Браузер не разрешает сохранить корзину. После перезагрузки изменения могут исчезнуть.',
      )
    }
  }, [items])
  async function add(id: number) {
    const response = await fetch(`/api/products/${id}`, { cache: 'no-store' })
    if (!response.ok)
      throw new Error('Не удалось добавить товар. Возможно, он больше не продаётся.')
    const product = (await response.json()) as Product
    if (!product.available) throw new Error('Товар больше не доступен для покупки')
    setItems((current) => {
      const existing = current.find((item) => item.id === id)
      if (existing)
        return current.map((item) =>
          item.id === id ? { id, quantity: Math.min(maxQuantity, item.quantity + 1) } : item,
        )
      return [...current, { id, quantity: 1 }]
    })
  }
  function setQuantity(id: number, quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > maxQuantity) return
    setItems((current) => current.map((item) => (item.id === id ? { id, quantity } : item)))
  }
  const remove = (id: number) => setItems((current) => current.filter((item) => item.id !== id))
  return (
    <CartContext.Provider value={{ items, storageError, add, setQuantity, remove }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('CartProvider отсутствует')
  return cart
}

export function CartNavigation() {
  const { items } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Link to="/cart" data-testid="nav-cart">
      Корзина{count > 0 && <span className="cart-badge">{count}</span>}
    </Link>
  )
}

export function AddToCart({ product }: { product: Product }) {
  const { add, items, storageError } = useCart()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const quantity = items.find((item) => item.id === product.id)?.quantity ?? 0
  async function addProduct() {
    setError('')
    setPending(true)
    try {
      await add(product.id)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось добавить товар')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="product-cart-actions">
      <button
        type="button"
        data-testid="product-add-to-cart"
        disabled={!product.available || pending || quantity >= maxQuantity}
        onClick={() => void addProduct()}
      >
        {pending ? 'Добавляем…' : 'В корзину'}
      </button>
      {quantity > 0 && (
        <p role="status">
          В корзине: {quantity}. <Link to="/cart">Открыть корзину</Link>
        </p>
      )}
      {(error || storageError) && <p role="alert">{error || storageError}</p>}
    </div>
  )
}

type ProductState = { product?: Product; error?: string }
function useCartProducts(items: CartItem[]) {
  const ids = items.map((item) => item.id).join(',')
  const [result, setResult] = useState<{ ids: string; products: Record<number, ProductState> }>({
    ids: '',
    products: {},
  })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const refresh = () => setAttempt((value) => value + 1)
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    setResult({ ids, products: {} })
    async function load() {
      const entries = await Promise.all(
        (ids ? ids.split(',').map(Number) : []).map(async (id): Promise<[number, ProductState]> => {
          try {
            const response = await fetch(`/api/products/${id}`, {
              signal: controller.signal,
              cache: 'no-store',
            })
            if (response.status === 404)
              return [id, { error: 'Товар удалён из каталога. Удалите его из корзины.' }]
            if (!response.ok) throw new Error('Не удалось проверить товар. Повторите загрузку.')
            return [id, { product: (await response.json()) as Product }]
          } catch (error) {
            return [
              id,
              { error: error instanceof Error ? error.message : 'Ошибка загрузки товара' },
            ]
          }
        }),
      )
      if (!controller.signal.aborted) setResult({ ids, products: Object.fromEntries(entries) })
    }
    void load()
    return () => controller.abort()
  }, [ids, attempt])
  return {
    products: result.ids === ids ? result.products : {},
    refresh: () => setAttempt((value) => value + 1),
  }
}

function Quantity({ item }: { item: CartItem }) {
  const { setQuantity } = useCart()
  const [draft, setDraft] = useState(String(item.quantity))
  useEffect(() => setDraft(String(item.quantity)), [item.quantity])
  const valid = /^\d+$/.test(draft) && Number(draft) >= 1 && Number(draft) <= maxQuantity
  return (
    <label>
      Количество
      <input
        type="number"
        data-testid="cart-item-qty"
        min="1"
        max={maxQuantity}
        step="1"
        value={draft}
        aria-invalid={!valid}
        onChange={(event) => {
          const value = event.target.value
          setDraft(value)
          if (/^\d+$/.test(value)) setQuantity(item.id, Number(value))
        }}
        onBlur={() => setDraft(String(item.quantity))}
      />
      {!valid && <span role="status">Введите целое число от 1 до {maxQuantity}</span>}
    </label>
  )
}

export function CartPage({ checkout = false }: { checkout?: boolean }) {
  const { items, remove, storageError } = useCart()
  const { products, refresh } = useCartProducts(items)
  const ready = items.every((item) => Boolean(products[item.id]))
  const valid =
    items.length > 0 && ready && items.every((item) => products[item.id]?.product?.available)
  const total = items.reduce((sum, item) => {
    const product = products[item.id]?.product
    return sum + (product?.available ? product.price.amount * item.quantity : 0)
  }, 0)
  if (checkout && items.length === 0) return <Navigate to="/cart" replace />
  return (
    <section className="cart-page">
      <h1>{checkout ? 'Оформление заказа' : 'Корзина'}</h1>
      {checkout && (
        <p>Проверьте состав корзины. Создание и отправка заказа появятся на следующем шаге.</p>
      )}
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
            {items.map((item) => {
              const state = products[item.id]
              const product = state?.product
              return (
                <article
                  key={item.id}
                  className="cart-row"
                  data-testid="cart-item"
                  data-product-id={item.id}
                >
                  <div>
                    {product ? (
                      <>
                        <h2>
                          <Link to={`/products/${product.id}`}>{product.name}</Link>
                        </h2>
                        <p data-testid="cart-item-price">
                          {currency.format(product.price.amount / 100)} за шт.
                        </p>
                        {!product.available && (
                          <p role="alert">Больше нет в наличии. Удалите товар, чтобы продолжить.</p>
                        )}
                      </>
                    ) : (
                      <p role={state?.error ? 'alert' : 'status'}>
                        {state?.error ?? 'Загружаем товар…'}
                      </p>
                    )}
                  </div>
                  <Quantity item={item} />
                  <button
                    type="button"
                    data-testid="cart-item-remove"
                    onClick={() => remove(item.id)}
                    aria-label={product ? `Удалить ${product.name}` : 'Удалить позицию'}
                  >
                    Удалить
                  </button>
                </article>
              )
            })}
          </div>
        </>
      )}
      <div className="cart-summary">
        <p>
          Итого:{' '}
          <strong data-testid="cart-total">
            {ready ? currency.format(total / 100) : 'Проверяем цены…'}
          </strong>
        </p>
        {!valid && items.length > 0 && ready && (
          <p role="alert">
            Недоступные и непроверенные товары не включены в итог. Удалите их или обновите данные.
          </p>
        )}
        <p>
          Сумма справочная. Окончательная стоимость будет проверена сервером при оформлении заказа.
        </p>
        {!checkout &&
          (valid ? (
            <Link className="home-catalog-link" to="/checkout" data-testid="cart-checkout">
              Перейти к оформлению
            </Link>
          ) : (
            <button type="button" data-testid="cart-checkout" disabled>
              Перейти к оформлению
            </button>
          ))}
        {checkout && <Link to="/cart">Вернуться в корзину</Link>}
      </div>
    </section>
  )
}
