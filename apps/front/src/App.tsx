import { Link, Route, Routes } from 'react-router-dom'

import { AuthForm, AuthNavigation } from './auth'
import { Catalog, ProductDetail } from './catalog'
import Home from './Home'
import { CartNavigation, CartPage } from './cart'
import { AccountOrders, Checkout, OrderSuccess, RequireAuth } from './orders'

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
          <AuthNavigation />
          <CartNavigation />
          <Link to="/catalog" data-testid="nav-catalog">
            Каталог комплектующих ↗
          </Link>
        </nav>
      </header>
      <main>
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
