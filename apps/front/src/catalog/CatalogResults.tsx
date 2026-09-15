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
    <div className="catalog-results">
      {result.error && (
        <div role="alert" data-testid="catalog-error">
          <p>{result.error}</p>
          <button type="button" onClick={result.retry}>
            Повторить
          </button>
        </div>
      )}
      {!result.error && !result.data && <p role="status">Загружаем товары…</p>}
      {result.data && <p data-testid="catalog-total">Найдено товаров: {result.data.total}</p>}
      {result.data?.items.length === 0 && (
        <p data-testid="catalog-empty">Ничего не найдено. Измените или сбросьте фильтры.</p>
      )}
      <div
        className="product-grid"
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
          className="catalog-pagination"
          aria-label="Страницы каталога"
        >
          <button
            type="button"
            data-testid="catalog-page-prev"
            disabled={result.data.page <= 1}
            onClick={() => changePage(Math.max(1, result.data!.page - 1))}
          >
            Назад
          </button>
          <span data-testid="catalog-page-current">
            Страница {result.data.page} из {Math.max(1, result.data.totalPages)}
          </span>
          <button
            type="button"
            data-testid="catalog-page-next"
            disabled={result.data.page >= result.data.totalPages}
            onClick={() => changePage(result.data!.page + 1)}
          >
            Далее
          </button>
        </nav>
      )}
    </div>
  )
}
