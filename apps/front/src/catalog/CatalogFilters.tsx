import { Button, Input, Select } from '../shared/ui'
import { useResource } from '../useResource'
import type { Category } from './types'
import type { useCatalogFilters } from './useCatalogFilters'

type Props = Pick<ReturnType<typeof useCatalogFilters>, 'draft' | 'update' | 'reset'>

export function CatalogFilters({ draft, update, reset }: Props) {
  const categories = useResource<Category[]>('/api/categories')
  return (
    <aside
      className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4"
      data-testid="catalog-filters"
      aria-label="Фильтры каталога"
    >
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Фильтры</h2>
      <label className="text-sm font-medium text-gray-800" htmlFor="filter-search">
        Название
      </label>
      <Input
        id="filter-search"
        data-testid="filter-search"
        type="search"
        maxLength={100}
        value={draft.search}
        onChange={(event) => update('search', event.target.value)}
      />
      <label className="text-sm font-medium text-gray-800" htmlFor="filter-category">
        Категория
      </label>
      <Select
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
      </Select>
      {categories.error && (
        <p className="text-sm text-red-600" role="alert">
          {categories.error}
          <Button type="button" onClick={categories.retry}>
            Повторить загрузку категорий
          </Button>
        </p>
      )}
      <label className="text-sm font-medium text-gray-800" htmlFor="filter-price-min">
        Цена от, ₽
      </label>
      <Input
        id="filter-price-min"
        data-testid="filter-price-min"
        type="number"
        min="0"
        max="21474836"
        step="1"
        value={draft.priceMin}
        onChange={(event) => update('priceMin', event.target.value)}
      />
      <label className="text-sm font-medium text-gray-800" htmlFor="filter-price-max">
        Цена до, ₽
      </label>
      <Input
        id="filter-price-max"
        data-testid="filter-price-max"
        type="number"
        min="0"
        max="21474836"
        step="1"
        value={draft.priceMax}
        onChange={(event) => update('priceMax', event.target.value)}
      />
      <label className="flex items-center gap-2 py-1 text-sm font-normal">
        <Input
          data-testid="filter-available"
          type="checkbox"
          checked={draft.available}
          onChange={(event) => update('available', event.target.checked)}
        />
        Только в наличии
      </label>
      <Button type="button" data-testid="filter-reset" onClick={reset}>
        Сбросить фильтры
      </Button>
    </aside>
  )
}
