import type { Product } from './types'

const categoryColors: Record<string, string> = {
  processors: 'bg-violet-50 text-violet-700',
  'graphics-cards': 'bg-indigo-50 text-indigo-700',
  memory: 'bg-emerald-50 text-emerald-700',
}

export function ProductImage({
  product,
  large = false,
  compact = false,
}: {
  product: Product
  large?: boolean
  compact?: boolean
}) {
  const regularSize = large ? 'h-72 sm:h-96' : 'h-44'
  const size = compact ? 'h-24 w-24 shrink-0' : `${regularSize} w-full`
  const regularTitle = large ? 'text-base sm:text-xl' : 'text-xs'
  const titleSize = compact ? 'text-[5px]' : regularTitle
  const regularCategory = large ? 'text-sm' : 'text-xs'
  const categorySize = compact ? 'text-[4px]' : regularCategory
  const colors = categoryColors[product.category_slug] ?? 'bg-amber-50 text-amber-700'
  return (
    <div
      className={`${size} ${colors} grid place-items-center overflow-hidden p-2`}
      role="img"
      aria-label={`${product.name} — ${product.category_name}`}
      data-testid="product-illustration"
      data-category={product.category_slug}
    >
      <div className={`relative aspect-[3/2] w-full ${large ? 'max-w-lg' : 'max-w-60'}`}>
        <svg className="block w-full opacity-20" viewBox="0 0 360 240" aria-hidden="true">
          <use href="/images/product-chip.svg#chip" />
        </svg>
        <div className="absolute inset-x-[27%] top-[28%] flex h-[37%] items-center justify-center px-1 text-center">
          <span className={`${titleSize} font-bold leading-tight wrap-anywhere`}>
            {product.name}
          </span>
        </div>
        <span className={`absolute inset-x-2 bottom-0 text-center ${categorySize} opacity-70`}>
          {product.category_name}
        </span>
      </div>
    </div>
  )
}
