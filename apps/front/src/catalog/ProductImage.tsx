import { useState } from 'react'

import type { Product } from './types'

export function ProductImage({ product, large = false }: { product: Product; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const size = large ? 'h-72 sm:h-96' : 'h-44'
  if (!product.image_url || failed)
    return (
      <div
        className={`grid ${size} w-full place-items-center bg-indigo-50 p-5 text-center text-sm text-indigo-400`}
        role="img"
        aria-label={`Нет изображения: ${product.name}`}
      >
        Изображение отсутствует
      </div>
    )
  return (
    <img
      className={`${size} w-full bg-indigo-50 object-contain p-5`}
      src={product.image_url}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
