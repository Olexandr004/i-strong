import { request } from '@/api/useRequest'
import { ChallengeType } from '@/interfaces/challenge'

export const getChallengeDetails = async (token: string | null) => {
  return request(`users/challenges`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getChallengesByType = async (token: string | null, type: ChallengeType) => {
  return request(`users/challenges/by-type/${type}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getChallengeById = async (token: string | null, challengeId: number) => {
  return request(`users/challenges/${challengeId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const postChallengeById = async (token: string | null, challengeData: any) => {
  return request(`users/challenges/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: challengeData,
  })
}

export const getCurrentChallengeDetails = async (token: string | null) => {
  return request(`users/challenges/current`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
