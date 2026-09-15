import { useCatalogFilters } from './useCatalogFilters'
import { CatalogFilters } from './CatalogFilters'
import { CatalogResults } from './CatalogResults'

export function Catalog() {
  const { queryString, draft, update, changePage, reset } = useCatalogFilters()
  return (
    <section data-testid="catalog">
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <CatalogFilters draft={draft} update={update} reset={reset} />
        <div className="min-w-0">
          <div className="mb-5 space-y-1">
            <h1
              className="text-2xl font-bold leading-tight tracking-tight text-gray-900"
              data-testid="app-title"
            >
              Комплектующие для ПК
            </h1>
            <p className="text-sm text-gray-500">
              Процессоры, видеокарты и память — с фильтрами по категории, цене и наличию.
            </p>
          </div>
          <CatalogResults queryString={queryString} changePage={changePage} />
        </div>
      </div>
    </section>
  )
}
