import { request } from '@/api/useRequest'
import { ChallengeType } from '@/interfaces/challenge'
import i18n from 'i18next'

export const getChallengeDetails = async (token: string | null) => {
  const langHeader = i18n.language === 'uk' ? 'ua' : 'en'
  return request(`users/challenges`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': langHeader,
    },
  })
}

export const getChallengesByType = async (token: string | null, type: ChallengeType) => {
  const langHeader = i18n.language === 'uk' ? 'ua' : 'en'
  return request(`users/challenges/by-type/${type}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': langHeader,
    },
  })
}

export const getChallengeById = async (token: string | null, challengeId: number) => {
  const langHeader = i18n.language === 'uk' ? 'ua' : 'en'
  return request(`users/challenges/${challengeId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': langHeader,
    },
  })
}

export const postChallengeById = async (token: string | null, challengeData: any) => {
  const langHeader = i18n.language === 'uk' ? 'ua' : 'en'
  return request(`users/challenges/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': langHeader,
    },
    body: challengeData,
  })
}

export const getCurrentChallengeDetails = async (token: string | null) => {
  const langHeader = i18n.language === 'uk' ? 'ua' : 'en'
  return request(`users/challenges/current`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': langHeader,
    },
  })
}
