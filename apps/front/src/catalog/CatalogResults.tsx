import { useEffect, useState } from 'react'

import { Button } from '../shared/ui'
import { useResource } from '../useResource'
import { ProductCard } from './ProductCard'
import { CatalogLoader, CatalogSkeleton } from './CatalogLoader'
import type { ProductPage } from './types'

export function CatalogResults({
  queryString,
  changePage,
}: {
  queryString: string
  changePage: (page: number) => void
}) {
  const result = useResource<ProductPage>(`/api/products?${queryString}`)
  const [previous, setPrevious] = useState<ProductPage>()
  useEffect(() => {
    if (result.data) setPrevious(result.data)
  }, [result.data])
  const loading = !result.error && !result.data
  // Keep the previous grid's exact height while filters are being refreshed.
  const data = result.data ?? (loading ? previous : undefined)
  return (
    <div className="relative min-w-0">
      {loading && <CatalogLoader />}
      {result.error && (
        <div role="alert" data-testid="catalog-error">
          <p>{result.error}</p>
          <Button type="button" onClick={result.retry}>
            Повторить
          </Button>
        </div>
      )}
      <p className="mb-4 h-4 text-xs text-gray-500" data-testid="catalog-total">
        {data ? `Найдено товаров: ${data.total}` : '\u00a0'}
      </p>
      {data?.items.length === 0 && (
        <p
          className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-gray-500"
          data-testid="catalog-empty"
        >
          Ничего не найдено. Измените или сбросьте фильтры.
        </p>
      )}
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-50' : ''}`}
        data-testid="catalog-list"
        aria-busy={loading}
        inert={loading}
      >
        {loading && !data && <CatalogSkeleton />}
        {data?.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {(data || loading) && (
        <nav
          data-testid="catalog-pagination"
          className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500"
          aria-label="Страницы каталога"
        >
          <Button
            type="button"
            data-testid="catalog-page-prev"
            disabled={loading || !data || data.page <= 1}
            onClick={() => data && changePage(Math.max(1, data.page - 1))}
          >
            Назад
          </Button>
          <span data-testid="catalog-page-current">
            {data ? `Страница ${data.page} из ${Math.max(1, data.totalPages)}` : 'Загрузка…'}
          </span>
          <Button
            type="button"
            data-testid="catalog-page-next"
            disabled={loading || !data || data.page >= data.totalPages}
            onClick={() => data && changePage(data.page + 1)}
          >
            Далее
          </Button>
        </nav>
      )}
    </div>
  )
}
