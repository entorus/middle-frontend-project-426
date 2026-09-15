import { Button } from '../shared/ui'
import { useResource } from '../useResource'
import { ProductCard } from './ProductCard'
import type { ProductPage } from './types'

export function CatalogResults({
  queryString,
  changePage,
}: {
  queryString: string
  changePage: (page: number) => void
}) {
  const result = useResource<ProductPage>(`/api/products?${queryString}`)
  return (
    <div className="min-w-0">
      {result.error && (
        <div role="alert" data-testid="catalog-error">
          <p>{result.error}</p>
          <Button type="button" onClick={result.retry}>
            Повторить
          </Button>
        </div>
      )}
      {!result.error && !result.data && (
        <p className="py-2 text-sm text-gray-500" role="status">
          Загружаем товары…
        </p>
      )}
      {result.data && (
        <p className="mb-4 text-xs text-gray-500" data-testid="catalog-total">
          Найдено товаров: {result.data.total}
        </p>
      )}
      {result.data?.items.length === 0 && (
        <p
          className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-gray-500"
          data-testid="catalog-empty"
        >
          Ничего не найдено. Измените или сбросьте фильтры.
        </p>
      )}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="catalog-list"
        aria-busy={!result.error && !result.data}
      >
        {result.data?.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {result.data && (
        <nav
          data-testid="catalog-pagination"
          className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500"
          aria-label="Страницы каталога"
        >
          <Button
            type="button"
            data-testid="catalog-page-prev"
            disabled={result.data.page <= 1}
            onClick={() => changePage(Math.max(1, result.data!.page - 1))}
          >
            Назад
          </Button>
          <span data-testid="catalog-page-current">
            Страница {result.data.page} из {Math.max(1, result.data.totalPages)}
          </span>
          <Button
            type="button"
            data-testid="catalog-page-next"
            disabled={result.data.page >= result.data.totalPages}
            onClick={() => changePage(result.data!.page + 1)}
          >
            Далее
          </Button>
        </nav>
      )}
    </div>
  )
}
