import { Link, Route, Routes } from 'react-router-dom'

import { Button } from './shared/ui'
import { AuthForm, AuthNavigation, RequireAuth } from './auth'
import { Catalog, ProductDetail } from './catalog'
import Home from './Home'
import { CartNavigation, CartPage } from './cart'
import { AccountOrders, Checkout, OrderSuccess } from './orders'

function MonitoringTest() {
  return (
    <section>
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Проверка мониторинга
      </h1>
      <Button
        type="button"
        onClick={() => {
          throw new Error('Frontend monitoring smoke test')
        }}
      >
        Отправить тестовую ошибку фронтенда
      </Button>
    </section>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-sm leading-relaxed text-gray-900 antialiased">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-gray-900"
          >
            <span className="size-2 rounded-sm bg-indigo-500" aria-hidden="true" /> Комплектующие
          </Link>
          <nav
            className="flex flex-wrap items-center gap-4 text-sm text-gray-600"
            aria-label="Основная навигация"
          >
            <Link to="/catalog" data-testid="nav-catalog">
              Каталог
            </Link>
            <CartNavigation />
            <AuthNavigation />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6">
        <Routes>
          <Route path="/signup" element={<AuthForm key="signup" mode="signup" />} />
          <Route path="/signin" element={<AuthForm key="signin" mode="signin" />} />
          <Route
            path="/account/*"
            element={
              <RequireAuth>
                <AccountOrders />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth checkout>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id/success"
            element={
              <RequireAuth>
                <OrderSuccess />
              </RequireAuth>
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          {import.meta.env.VITE_SENTRY_TEST_ENABLED === 'true' && (
            <Route path="/monitoring-test" element={<MonitoringTest />} />
          )}
          <Route
            path="*"
            element={
              <section>
                <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                  Страница не найдена
                </h1>
                <Link to="/catalog">Перейти в каталог</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="mt-12 border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-gray-400 sm:px-6">
          <span>Магазин комплектующих для ПК — учебный проект Хекслета</span>
          <Link to="/catalog" className="hover:text-indigo-600">
            Каталог
          </Link>
        </div>
      </footer>
    </div>
  )
}
