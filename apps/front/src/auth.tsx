import { createContext, useContext, useEffect, useState } from 'react'
import type { SubmitEvent, ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import type { components, operations } from './generated/api'

type User = components['schemas']['User']
type Credentials = components['schemas']['Credentials']
type AuthState = {
  user: User | null
  loading: boolean
  error: string
  setUser: (user: User | null) => void
}
const AuthContext = createContext<AuthState | null>(null)

type SignoutResult = operations['signout']['responses'][200]['content']['application/json']

function authRequest(path: 'signout'): Promise<SignoutResult>
function authRequest(path: 'signup' | 'signin', credentials: Credentials): Promise<User>
async function authRequest(path: string, credentials?: Credentials): Promise<User | SignoutResult> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    ...(credentials
      ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }
      : {}),
  })
  if (!response.ok) {
    const body = (await response.json()) as components['schemas']['ApiError']
    throw new Error(body.message)
  }
  return response.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch('/api/auth/me', {
          signal: controller.signal,
          cache: 'no-store',
        })
        if (response.status === 401) setUser(null)
        else if (response.ok) setUser(await response.json())
        else throw new Error('Не удалось проверить авторизацию. Обновите страницу.')
      } catch {
        if (!controller.signal.aborted)
          setError('Не удалось проверить авторизацию. Обновите страницу.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])
  return (
    <AuthContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider отсутствует')
  return value
}

export function AuthNavigation() {
  const { user, loading, error, setUser } = useAuth()
  const [signoutError, setSignoutError] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  if (loading) return <span role="status">Проверяем вход…</span>
  if (error) return <span role="alert">{error}</span>
  if (!user)
    return (
      <>
        <Link to="/signup" data-testid="nav-signup">
          Регистрация
        </Link>
        <Link to="/signin" data-testid="nav-signin">
          Войти
        </Link>
      </>
    )
  async function signout() {
    setPending(true)
    setSignoutError('')
    try {
      await authRequest('signout')
      setUser(null)
      navigate('/signin', { replace: true })
    } catch {
      setSignoutError('Не удалось выйти. Попробуйте ещё раз.')
    } finally {
      setPending(false)
    }
  }
  return (
    <>
      <Link to="/account" data-testid="nav-account">
        Личный кабинет
      </Link>
      <button
        type="button"
        data-testid="nav-signout"
        disabled={pending}
        onClick={() => void signout()}
      >
        Выйти
      </button>
      {signoutError && <span role="alert">{signoutError}</span>}
    </>
  )
}

export function AuthForm({ mode }: { mode: 'signup' | 'signin' }) {
  const [params] = useSearchParams()
  const destination = params.get('next') === 'checkout' ? '/checkout' : '/account'
  const { user, loading, error: sessionError, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  if (loading) return <p role="status">Проверяем вход…</p>
  if (sessionError) return <p role="alert">{sessionError}</p>
  if (user) return <Navigate to={destination} replace />
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const current = await authRequest(mode, { email, password })
      setUser(current)
      setPassword('')
      navigate(destination, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось отправить форму')
    } finally {
      setPending(false)
    }
  }
  return (
    <section className="auth-panel">
      <h1>{mode === 'signup' ? 'Регистрация' : 'Вход'}</h1>
      <form onSubmit={(event) => void submit(event)}>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          data-testid="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="auth-password">Пароль</label>
        <input
          id="auth-password"
          data-testid="auth-password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p>Пароль — от 8 до 128 символов.</p>
        {error && (
          <p role="alert" data-testid="auth-error">
            {error}
          </p>
        )}
        <button data-testid="auth-submit" disabled={pending} type="submit">
          {pending ? 'Подождите…' : 'Продолжить'}
        </button>
      </form>
      <Link to={mode === 'signup' ? '/signin' : '/signup'}>
        {mode === 'signup' ? 'Уже есть аккаунт? Войти' : 'Создать аккаунт'}
      </Link>
    </section>
  )
}
