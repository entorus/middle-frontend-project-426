import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../shared/ui'
import { useCart } from './CartProvider'
import { maxQuantity } from './storage'
import type { components } from '../generated/api'

type Product = components['schemas']['Product']

export function AddToCart({
  product,
  catalog = false,
  testId = 'product-add-to-cart',
}: {
  product: Product
  catalog?: boolean
  testId?: 'product-add-to-cart' | 'catalog-add-to-cart' | 'home-promo-add-to-cart'
}) {
  const navigate = useNavigate()
  const { add, items, storageError } = useCart()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const quantity = items.find((item) => item.id === product.id)?.quantity ?? 0
  const inCart = quantity > 0
  const opensCart = catalog && inCart
  let label = 'В корзину'
  if (catalog) label = inCart ? 'В корзине' : 'Купить'
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
        variant={catalog && inCart ? 'primaryOutline' : 'primary'}
        className={catalog ? 'w-full border border-indigo-500' : 'w-full'}
        type="button"
        data-testid={testId}
        disabled={pending || (!opensCart && (!product.available || quantity >= maxQuantity))}
        onClick={() => {
          if (opensCart) navigate('/cart')
          else void addProduct()
        }}
      >
        {pending ? 'Добавляем…' : label}
      </Button>
      {inCart && !catalog && (
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
