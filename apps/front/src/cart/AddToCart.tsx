import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from './CartProvider'
import { maxQuantity } from './storage'
import type { components } from '../generated/api'

type Product = components['schemas']['Product']

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
