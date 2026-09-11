import { useEffect, useState } from 'react'
import { Link, Route, Routes, useSearchParams } from 'react-router-dom'

interface Category {
  id: number
  slug: string
  name: string
}
interface Product {
  id: number
  sku: string
  name: string
  description: string
  price_kopecks: number
  category_slug: string
  category_name: string
}

const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function Catalog() {
  const [params, setParams] = useSearchParams()
  const selected = params.get('category') ?? ''
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setStatus('loading')
      try {
        const responses = await Promise.all([
          fetch('/api/categories', { signal: controller.signal }),
          fetch('/api/products', { signal: controller.signal }),
        ])
        if (responses.some((response) => !response.ok)) throw new Error('Каталог недоступен')
        const [categoryData, productData] = await Promise.all(
          responses.map((response) => response.json()),
        )
        if (!controller.signal.aborted) {
          setCategories(categoryData)
          setProducts(productData)
          setStatus('ready')
        }
      } catch {
        if (!controller.signal.aborted) setStatus('error')
      }
    }
    void load()
    return () => controller.abort()
  }, [attempt])

  const visible = products.filter((product) => !selected || product.category_slug === selected)
  return (
    <>
      <section className="hero">
        <p className="eyebrow">КОМПЛЕКТУЮЩИЕ ДЛЯ ПК</p>
        <h1 data-testid="app-title">
          Ваш следующий
          <br />
          апгрейд — здесь.
        </h1>
        <p className="intro">
          Начните с главного. Подберите компоненты для работы, творчества и игр.
        </p>
        <span className="demo-note">Учебный каталог · демонстрационные цены</span>
      </section>
      <section aria-labelledby="catalog-title" data-testid="catalog">
        <div className="section-heading">
          <h2 id="catalog-title">Каталог</h2>
          <span>{status === 'ready' ? `${visible.length} товаров` : 'Загрузка каталога'}</span>
        </div>
        <div className="filters" aria-label="Категории">
          <button type="button" aria-pressed={!selected} onClick={() => setParams({})}>
            Все компоненты
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              data-testid={`category-${category.slug}`}
              aria-pressed={selected === category.slug}
              onClick={() => setParams({ category: category.slug })}
            >
              {category.name}
            </button>
          ))}
        </div>
        {status === 'loading' && <p role="status">Загружаем товары…</p>}
        {status === 'error' && (
          <div role="alert" data-testid="catalog-error">
            <p>Не удалось загрузить каталог. Попробуйте ещё раз.</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)}>
              Повторить
            </button>
          </div>
        )}
        {status === 'ready' && visible.length === 0 && <p>В этой категории пока нет товаров.</p>}
        <div className="product-grid">
          {status === 'ready' &&
            visible.map((product) => (
              <article
                className="product"
                key={product.id}
                data-testid="product-card"
                data-category={product.category_slug}
              >
                <div className="component-art" aria-hidden="true">
                  <span>{product.category_slug === 'processors' ? 'CPU' : 'GPU'}</span>
                  <i />
                  <i />
                  <i />
                </div>
                <p className="eyebrow">{product.category_name}</p>
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <div className="product-bottom">
                  <strong>{currency.format(product.price_kopecks / 100)}</strong>
                  <span>{product.sku}</span>
                </div>
              </article>
            ))}
        </div>
      </section>
    </>
  )
}

function MonitoringTest() {
  return (
    <section>
      <h1>Проверка мониторинга</h1>
      <button
        type="button"
        onClick={() => {
          throw new Error('Frontend monitoring smoke test')
        }}
      >
        Отправить тестовую ошибку фронтенда
      </button>
    </section>
  )
}

export default function App() {
  return (
    <div className="shell">
      <header>
        <Link to="/" className="brand">
          PS<span> / </span>PARTS
        </Link>
        <nav>
          <Link to="/catalog" data-testid="catalog-link">
            Каталог комплектующих ↗
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/catalog" element={<Catalog />} />
          {import.meta.env.VITE_SENTRY_TEST_ENABLED === 'true' && (
            <Route path="/monitoring-test" element={<MonitoringTest />} />
          )}
          <Route
            path="*"
            element={
              <section>
                <h1>Страница не найдена</h1>
                <Link to="/catalog">Перейти в каталог</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <span>PS PARTS</span>
        <span>Учебный проект · React + Fastify + PostgreSQL</span>
      </footer>
    </div>
  )
}
