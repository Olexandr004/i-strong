import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { useCommonStore } from '@/shared/stores'

export const useTanStackClient = () => {
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        handleChangeCommonStore({ errorText: error.message })
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        handleChangeCommonStore({ errorText: error.message })
      },
    }),
  })

  return { queryClient }
}
