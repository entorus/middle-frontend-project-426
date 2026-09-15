import { useCatalogFilters } from './useCatalogFilters'
import { CatalogFilters } from './CatalogFilters'
import { CatalogResults } from './CatalogResults'

export function Catalog() {
  const { queryString, draft, update, changePage, reset } = useCatalogFilters()
  return (
    <section data-testid="catalog">
      <div className="catalog-heading">
        <p className="eyebrow">КОМПЛЕКТУЮЩИЕ ДЛЯ ПК</p>
        <h1 data-testid="app-title">Каталог</h1>
        <p>Подберите компоненты для вашей сборки. Демонстрационные цены.</p>
      </div>
      <div className="catalog-layout">
        <CatalogFilters draft={draft} update={update} reset={reset} />
        <CatalogResults queryString={queryString} changePage={changePage} />
      </div>
    </section>
  )
}
