import './instrument'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'

import App from './App'
import { AuthProvider } from './auth'
import './style.css'

const root = document.getElementById('root')
if (!root) throw new Error('Не найден корневой элемент приложения')

createRoot(root).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={<p role="alert">Не удалось открыть приложение. Обновите страницу.</p>}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
