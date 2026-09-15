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
  if (loading)
    return (
      <p className="py-2 text-sm text-gray-500" role="status">
        Проверяем вход…
      </p>
    )
  if (error)
    return (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )
  if (!user) return <Navigate to={checkout ? '/signin?next=checkout' : '/signin'} replace />
  return children
}
