import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type { components } from '../generated/api'
import { readCart, storageKey, maxQuantity } from './storage'
import type { CartItem } from './storage'

type Product = components['schemas']['Product']

type CartState = {
  items: CartItem[]
  storageError: string
  add: (id: number) => Promise<void>
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
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
    <CartContext.Provider
      value={{ items, storageError, add, setQuantity, remove, clear: () => setItems([]) }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('CartProvider отсутствует')
  return cart
}
