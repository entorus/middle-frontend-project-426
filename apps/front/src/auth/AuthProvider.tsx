import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type { components } from '../generated/api'

type User = components['schemas']['User']
type AuthState = {
  user: User | null
  loading: boolean
  error: string
  setUser: (user: User | null) => void
}
const AuthContext = createContext<AuthState | null>(null)
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
