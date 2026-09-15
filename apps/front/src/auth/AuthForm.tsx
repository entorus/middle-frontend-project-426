import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { Button, Input } from '../shared/ui'
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
  if (loading)
    return (
      <p className="py-2 text-sm text-gray-500" role="status">
        Проверяем вход…
      </p>
    )
  if (sessionError)
    return (
      <p className="text-sm text-red-600" role="alert">
        {sessionError}
      </p>
    )
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
    <section className="mx-auto my-8 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 sm:my-14 sm:p-8">
      <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        {mode === 'signup' ? 'Регистрация' : 'Вход'}
      </h1>
      <form className="mb-5 grid gap-3" onSubmit={(event) => void submit(event)}>
        <label className="text-sm font-medium text-gray-800" htmlFor="auth-email">
          Email
        </label>
        <Input
          id="auth-email"
          data-testid="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="text-sm font-medium text-gray-800" htmlFor="auth-password">
          Пароль
        </label>
        <Input
          id="auth-password"
          data-testid="auth-password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="text-xs text-gray-500">Пароль — от 8 до 128 символов.</p>
        {error && (
          <p className="text-sm text-red-600" role="alert" data-testid="auth-error">
            {error}
          </p>
        )}
        <Button variant="primary" data-testid="auth-submit" disabled={pending} type="submit">
          {pending ? 'Подождите…' : 'Продолжить'}
        </Button>
      </form>
      <Link to={mode === 'signup' ? '/signin' : '/signup'}>
        {mode === 'signup' ? 'Уже есть аккаунт? Войти' : 'Создать аккаунт'}
      </Link>
    </section>
  )
}
