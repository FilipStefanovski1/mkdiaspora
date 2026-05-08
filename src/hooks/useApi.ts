import { useState, useEffect, useCallback, useRef } from 'react'
import type { DependencyList } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export interface UseApiResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic data-fetching hook.
 *
 * - `fetcher` is stored in a ref so callers don't need to memoize it.
 * - Pass `deps` when the fetcher depends on route params or external state.
 *   Changing a dep triggers a fresh fetch (same semantics as useEffect deps).
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: DependencyList = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setStatus('success')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
    // trigger + deps drive re-fetches; fetcherRef is intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, ...deps])

  const refetch = useCallback(() => setTrigger((t) => t + 1), [])

  return {
    data,
    isLoading: status === 'idle' || status === 'loading',
    error,
    refetch,
  }
}
