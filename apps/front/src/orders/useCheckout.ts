import { useState } from 'react'
import type { SubmitEvent } from 'react'

import { useAuth } from '../auth'
import { useCart } from '../cart'
import type { components } from '../generated/api'

type Order = components['schemas']['Order']
type CreateOrder = components['schemas']['CreateOrder']

export function useCheckout() {
  const { items, clear } = useCart()
  const { setUser } = useAuth()
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pending, setPending] = useState(false)
  const [createdId, setCreatedId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [problems, setProblems] = useState<components['schemas']['ProblemProduct'][]>([])
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || items.length === 0) return
    setPending(true)
    setError('')
    setProblems([])
    const receiving: CreateOrder['receiving'] =
      method === 'delivery' ? { method, name, phone, address } : { method, name, phone }
    const payload: CreateOrder = {
      items: items.map(({ id, quantity }) => ({ id, quantity })),
      receiving,
    }
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        setUser(null)
        return
      }
      if (!response.ok) {
        const body = (await response.json()) as components['schemas']['ApiError'] & {
          products?: components['schemas']['ProblemProduct'][]
        }
        setError(body.message)
        setProblems(body.products ?? [])
        return
      }
      const order = (await response.json()) as Order
      setCreatedId(order.id)
      clear()
    } catch {
      setError(
        'Не удалось получить подтверждение. Проверьте историю заказов перед повторной отправкой.',
      )
    } finally {
      setPending(false)
    }
  }
  return {
    items,
    method,
    setMethod,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    pending,
    createdId,
    error,
    problems,
    submit,
  }
}
