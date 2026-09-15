import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { emptyFilters } from './types'
import type { Filters } from './types'

export function useCatalogFilters() {
  const [params, setParams] = useSearchParams()
  const queryString = params.toString()
  const [draft, setDraft] = useState<Filters>(emptyFilters)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const values = new URLSearchParams(queryString)
    setDraft({
      category: values.get('category') ?? '',
      priceMin: values.get('priceMin') ?? '',
      priceMax: values.get('priceMax') ?? '',
      available: values.get('available') === 'true',
      search: values.get('search') ?? '',
    })
    clearTimeout(timer.current)
    return () => clearTimeout(timer.current)
  }, [queryString])

  function commit(values: Filters) {
    const next = new URLSearchParams()
    for (const name of ['category', 'priceMin', 'priceMax', 'search'] as const) {
      const value = values[name].trim()
      if (value) next.set(name, value)
    }
    if (values.available) next.set('available', 'true')
    setParams(next)
  }
  function update<K extends keyof Filters>(name: K, value: Filters[K]) {
    const next = { ...draft, [name]: value }
    setDraft(next)
    clearTimeout(timer.current)
    if (name === 'search') timer.current = setTimeout(() => commit(next), 350)
    else commit(next)
  }
  function changePage(page: number) {
    clearTimeout(timer.current)
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
  }
  function reset() {
    clearTimeout(timer.current)
    setDraft(emptyFilters)
    setParams({})
  }
  return { queryString, draft, update, changePage, reset }
}
