import { useState } from 'react'

import type { Product } from './types'

export function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false)
  if (!product.image_url || failed)
    return (
      <div className="image-placeholder" role="img" aria-label={`Нет изображения: ${product.name}`}>
        Изображение отсутствует
      </div>
    )
  return (
    <img
      className="product-image"
      src={product.image_url}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
