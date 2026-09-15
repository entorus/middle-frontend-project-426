import { useEffect, useState } from 'react'

import { Input } from '../shared/ui'
import { useCart } from './CartProvider'
import { maxQuantity } from './storage'
import type { CartItem } from './storage'

export function Quantity({ item }: { item: CartItem }) {
  const { setQuantity } = useCart()
  const [draft, setDraft] = useState(String(item.quantity))
  useEffect(() => setDraft(String(item.quantity)), [item.quantity])
  const valid = /^\d+$/.test(draft) && Number(draft) >= 1 && Number(draft) <= maxQuantity
  return (
    <label className="grid gap-2 text-sm font-medium text-gray-800">
      Количество
      <Input
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
