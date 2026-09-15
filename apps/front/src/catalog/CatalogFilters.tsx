import { useResource } from '../useResource'
import type { Category } from './types'
import type { useCatalogFilters } from './useCatalogFilters'

type Props = Pick<ReturnType<typeof useCatalogFilters>, 'draft' | 'update' | 'reset'>

export function CatalogFilters({ draft, update, reset }: Props) {
  const categories = useResource<Category[]>('/api/categories')
  return (
    <aside className="catalog-filters" data-testid="catalog-filters" aria-label="Фильтры каталога">
      <h2>Фильтры</h2>
      <label htmlFor="filter-search">Название</label>
      <input
        id="filter-search"
        data-testid="filter-search"
        type="search"
        maxLength={100}
        value={draft.search}
        onChange={(event) => update('search', event.target.value)}
      />
      <label htmlFor="filter-category">Категория</label>
      <select
        id="filter-category"
        data-testid="filter-category"
        value={draft.category}
        onChange={(event) => update('category', event.target.value)}
      >
        <option value="">Все категории</option>
        {categories.data?.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      {categories.error && (
        <p role="alert">
          {categories.error}
          <button type="button" onClick={categories.retry}>
            Повторить загрузку категорий
          </button>
        </p>
      )}
      <label htmlFor="filter-price-min">Цена от, ₽</label>
      <input
        id="filter-price-min"
        data-testid="filter-price-min"
        type="number"
        min="0"
        max="21474836"
        step="1"
        value={draft.priceMin}
        onChange={(event) => update('priceMin', event.target.value)}
      />
      <label htmlFor="filter-price-max">Цена до, ₽</label>
      <input
        id="filter-price-max"
        data-testid="filter-price-max"
        type="number"
        min="0"
        max="21474836"
        step="1"
        value={draft.priceMax}
        onChange={(event) => update('priceMax', event.target.value)}
      />
      <label className="availability-filter">
        <input
          data-testid="filter-available"
          type="checkbox"
          checked={draft.available}
          onChange={(event) => update('available', event.target.checked)}
        />
        Только в наличии
      </label>
      <button type="button" data-testid="filter-reset" onClick={reset}>
        Сбросить фильтры
      </button>
    </aside>
  )
}
