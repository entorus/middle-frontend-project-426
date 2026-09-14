import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import type { components } from './generated/api'
import { useResource } from './useResource'
import { AddToCart } from './cart'

type Product = components['schemas']['Product']
type ProductPage = components['schemas']['ProductPage']
type Category = components['schemas']['Category']
type Filters = {
  category: string
  priceMin: string
  priceMax: string
  available: boolean
  search: string
}
const emptyFilters: Filters = {
  category: '',
  priceMin: '',
  priceMax: '',
  available: false,
  search: '',
}
const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function ProductImage({ product }: { product: Product }) {
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

function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className="product"
      data-testid="catalog-item"
      data-category={product.category_slug}
      data-product-id={product.id}
    >
      <ProductImage product={product} />
      <p className="eyebrow">{product.category_name}</p>
      <h3>
        <Link to={`/products/${product.id}`} data-testid="catalog-item-name">
          {product.name}
        </Link>
      </h3>
      <p className="description">{product.description}</p>
      <strong data-testid="catalog-item-price">
        {currency.format(product.price.amount / 100)}
      </strong>
      <p data-testid="catalog-item-availability" data-available={String(product.available)}>
        {product.available ? 'В наличии' : 'Нет в наличии'}
      </p>
    </article>
  )
}

export function Catalog() {
  const [params, setParams] = useSearchParams()
  const queryString = params.toString()
  const [draft, setDraft] = useState<Filters>(emptyFilters)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const values = new URLSearchParams(queryString)
    setDraft({
      category: values.get('category') ?? '',
      priceMin: values.get('priceMin') ?? '',
      priceMax: values.get('priceMax') ?? '',
      available: values.get('available') === 'true',
      search: values.get('search') ?? '',
    })
    clearTimeout(timer.current)
    return () => clearTimeout(timer.current)
  }, [queryString])
  const categories = useResource<Category[]>('/api/categories')
  const result = useResource<ProductPage>(`/api/products?${queryString}`)

  function commit(values: Filters) {
    const next = new URLSearchParams()
    for (const name of ['category', 'priceMin', 'priceMax', 'search'] as const) {
      const value = values[name].trim()
      if (value) next.set(name, value)
    }
    if (values.available) next.set('available', 'true')
    setParams(next)
  }
  function update<K extends keyof Filters>(name: K, value: Filters[K]) {
    const next = { ...draft, [name]: value }
    setDraft(next)
    clearTimeout(timer.current)
    if (name === 'search') timer.current = setTimeout(() => commit(next), 350)
    else commit(next)
  }
  function changePage(page: number) {
    clearTimeout(timer.current)
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
  }
  return (
    <section data-testid="catalog">
      <div className="catalog-heading">
        <p className="eyebrow">КОМПЛЕКТУЮЩИЕ ДЛЯ ПК</p>
        <h1 data-testid="app-title">Каталог</h1>
        <p>Подберите компоненты для вашей сборки. Демонстрационные цены.</p>
      </div>
      <div className="catalog-layout">
        <aside
          className="catalog-filters"
          data-testid="catalog-filters"
          aria-label="Фильтры каталога"
        >
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
          <button
            type="button"
            data-testid="filter-reset"
            onClick={() => {
              clearTimeout(timer.current)
              setDraft(emptyFilters)
              setParams({})
            }}
          >
            Сбросить фильтры
          </button>
        </aside>
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
      </div>
    </section>
  )
}

export function ProductDetail() {
  const { id } = useParams()
  const { data, error } = useResource<Product>(`/api/products/${encodeURIComponent(id ?? '')}`)
  return (
    <section className="product-detail">
      <Link to="/catalog">← В каталог</Link>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Загрузка…</p>}
      {data && (
        <>
          <h1 data-testid="product-name">{data.name}</h1>
          <ProductImage key={data.id} product={data} />
          <p data-testid="product-description">{data.description}</p>
          <strong data-testid="product-price">{currency.format(data.price.amount / 100)}</strong>
          <p>{data.available ? 'В наличии' : 'Нет в наличии'}</p>
          <AddToCart key={data.id} product={data} />
        </>
      )}
    </section>
  )
}
