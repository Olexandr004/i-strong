'use client'
import { useQuery } from '@tanstack/react-query'

import { request } from '@/api/useRequest'
import { IMoodStat, IMoodTrack } from '@/interfaces/user'

export const postMood = (token: string, form: IMoodTrack) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/mood/`, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetStatistics = (token: string, form: IMoodStat) => {
  return useQuery({ queryKey: ['getStatistics'], queryFn: () => getStatistics(token, form) })
}

export const getStatistics = async (token: string, form: IMoodStat) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/mood-stats/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: form,
  })
}
