import { useEffect, useState } from 'react'

import type { components } from '../generated/api'
import type { CartItem } from './storage'

type Product = components['schemas']['Product']

export type ProductState = { product?: Product; error?: string }
export function useCartProducts(items: CartItem[]) {
  const ids = items.map((item) => item.id).join(',')
  const [result, setResult] = useState<{ ids: string; products: Record<number, ProductState> }>({
    ids: '',
    products: {},
  })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const refresh = () => setAttempt((value) => value + 1)
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    setResult({ ids, products: {} })
    async function load() {
      const entries = await Promise.all(
        (ids ? ids.split(',').map(Number) : []).map(async (id): Promise<[number, ProductState]> => {
          try {
            const response = await fetch(`/api/products/${id}`, {
              signal: controller.signal,
              cache: 'no-store',
            })
            if (response.status === 404)
              return [id, { error: 'Товар удалён из каталога. Удалите его из корзины.' }]
            if (!response.ok) throw new Error('Не удалось проверить товар. Повторите загрузку.')
            return [id, { product: (await response.json()) as Product }]
          } catch (error) {
            return [
              id,
              { error: error instanceof Error ? error.message : 'Ошибка загрузки товара' },
            ]
          }
        }),
      )
      if (!controller.signal.aborted) setResult({ ids, products: Object.fromEntries(entries) })
    }
    void load()
    return () => controller.abort()
  }, [ids, attempt])
  return {
    products: result.ids === ids ? result.products : {},
    refresh: () => setAttempt((value) => value + 1),
  }
}
