import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from './AuthProvider'
import { authRequest } from './api'

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
