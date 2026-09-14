import { useEffect, useState } from 'react'

import type { components } from './generated/api'

export function useResource<T>(url: string) {
  const [state, setState] = useState<{ url: string; data?: T; error?: string }>({ url })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setState({ url })
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          const body = (await response.json()) as components['schemas']['ApiError']
          throw new Error(body.message)
        }
        const data = (await response.json()) as T
        if (!controller.signal.aborted) setState({ url, data })
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            url,
            error: error instanceof Error ? error.message : 'Не удалось загрузить данные',
          })
      }
    }
    void load()
    return () => controller.abort()
  }, [url, attempt])
  return { ...(state.url === url ? state : { url }), retry: () => setAttempt((value) => value + 1) }
}
