import { useState, useEffect, useCallback, useRef } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export interface UseApiResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic data-fetching hook. Store `fetcher` in a ref so callers don't
 * need to memoize it — only the `trigger` counter drives re-fetches.
 */
export function useApi<T>(fetcher: () => Promise<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

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
  }, [trigger])

  const refetch = useCallback(() => setTrigger((t) => t + 1), [])

  return {
    data,
    isLoading: status === 'idle' || status === 'loading',
    error,
    refetch,
  }
}
