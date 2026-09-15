import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from './AuthProvider'
import { authRequest } from './api'

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
