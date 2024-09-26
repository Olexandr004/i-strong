import { useRequest } from '@/api/useRequest'
import { ChallengeType } from '@/interfaces/challenge'

export const getChallengeDetails = async (token: string | null) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/challenges`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getChallengesByType = async (token: string | null, type: ChallengeType) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/challenges/by-type/${type}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getChallengeById = async (token: string | null, challengeId: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/challenges/${challengeId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const postChallengeById = async (token: string | null, challengeData: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/challenges/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: challengeData,
  })
}

export const getCurrentChallengeDetails = async (token: string | null) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/challenges/current`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
