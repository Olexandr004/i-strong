import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

import { useCallback } from 'react'

// query search params hook
export const useQuerySearchParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push } = useRouter()

  const createQuery = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)

      if (value) {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams],
  )

  const changeQuery = (name: string, value: string) => {
    push(pathname + '?' + createQuery(name, value))
  }

  const setMultiplyParams = (
    params: Record<string, string | undefined>,
    currentSearchParams?: URLSearchParams,
  ): string => {
    const newSearchParams = new URLSearchParams(currentSearchParams?.toString() ?? '')

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        newSearchParams.set(key, String(value))
      } else {
        newSearchParams.delete(key)
      }
    }

    return newSearchParams.toString()
  }

  const setQuery = (params: Record<string, string | undefined>, search?: URLSearchParams) => {
    push(pathname + '?' + setMultiplyParams(params, search))
  }

  const resetParams = () => {
    push(pathname)
  }

  const removeFromParams = (name: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(name)
    push(pathname + '?' + params.toString())
  }

  const allQueriesParams = String(new URLSearchParams(searchParams))

  // return
  return {
    push,
    searchParams,
    allQueriesParams,
    changeQuery,
    resetParams,
    removeFromParams,
    setQuery,
  }
}
