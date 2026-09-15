import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../shared/ui'
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
    <div className="mt-4 space-y-3">
      <Button
        variant="primary"
        className="w-full"
        type="button"
        data-testid="product-add-to-cart"
        disabled={!product.available || pending || quantity >= maxQuantity}
        onClick={() => void addProduct()}
      >
        {pending ? 'Добавляем…' : 'В корзину'}
      </Button>
      {quantity > 0 && (
        <p className="py-2 text-sm text-gray-500" role="status">
          В корзине: {quantity}. <Link to="/cart">Открыть корзину</Link>
        </p>
      )}
      {(error || storageError) && (
        <p className="text-sm text-red-600" role="alert">
          {error || storageError}
        </p>
      )}
    </div>
  )
}
