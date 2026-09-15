import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from './AuthProvider'

export function RequireAuth({
  children,
  checkout = false,
}: {
  children: ReactNode
  checkout?: boolean
}) {
  const { user, loading, error } = useAuth()
  if (loading) return <p role="status">Проверяем вход…</p>
  if (error) return <p role="alert">{error}</p>
  if (!user) return <Navigate to={checkout ? '/signin?next=checkout' : '/signin'} replace />
  return children
}
