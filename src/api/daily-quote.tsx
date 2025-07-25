'use client'
import { useQuery } from '@tanstack/react-query'

import { request } from './useRequest'

export const getDailyQuote = async (token: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`main/daily-quote`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetQuery = (token: string) => {
  return useQuery({
    queryKey: ['getQuote'],
    queryFn: () => getDailyQuote(token),
    // staleTime: 1000 * 60,
    // refetchInterval: 600,
  })
}
