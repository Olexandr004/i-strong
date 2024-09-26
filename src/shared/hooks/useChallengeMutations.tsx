import { useMutation } from '@tanstack/react-query'

import { useState } from 'react'

import {
  getChallengeById,
  getChallengeDetails,
  getChallengesByType,
  getCurrentChallengeDetails,
  postChallengeById,
} from '@/api/challenge.api'
import { ChallengeType, IChallenge } from '@/interfaces/challenge'
import { useCommonStore, useUserStore } from '@/shared/stores'

interface IPostChallenge {
  challenge_id: number
  subtask_id?: number
  note?: string
}

const handleError = (error: Error) => {
  console.log(`Error: ${error.message}`)
}

export const useChallengeDetails = () => {
  const { user } = useUserStore()
  const token = user?.access_token ?? null
  const [challenges, setChallenges] = useState<IChallenge[] | null>(null)
  const { mutate: challengeDetailsMutate, status } = useMutation({
    mutationFn: () => getChallengeDetails(token),
    onSuccess: (data: any) => {
      setChallenges(data)
    },
    onError: handleError,
  })

  return { challengeDetailsMutate, status, challenges }
}

export const useChallengesByType = () => {
  const { user } = useUserStore()
  const token = user?.access_token ?? null
  const [challenges, setChallenges] = useState<IChallenge[] | null>(null)
  const { mutate: challengesByTypeMutate, status: statusChallengesByType } = useMutation({
    mutationFn: (type: ChallengeType) => getChallengesByType(token, type),
    onSuccess: (data: any) => {
      if (Array.isArray(data.challenges)) {
        setChallenges(data.challenges)
      } else {
        setChallenges(null)
      }
    },
    onError: handleError,
  })

  return { challengesByTypeMutate, statusChallengesByType, challenges }
}

export const useChallengeById = () => {
  const { user } = useUserStore()
  const token = user?.access_token ?? null
  const [challenge, setChallenge] = useState<IChallenge | null>(null)
  const { mutate: challengeByIdMutate, status } = useMutation({
    mutationFn: (challengeId: number) => getChallengeById(token, challengeId),
    onSuccess: (data: any) => {
      if (data) {
        setChallenge(data)
      } else {
        setChallenge(null)
      }
    },
    onError: handleError,
  })

  return { challengeByIdMutate, status, challenge }
}

export const useCompleteChallenge = () => {
  const { user, handleChangeUserStore } = useUserStore()
  const token = user?.access_token ?? null
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { mutate: completeChallengePartMutate, status: statusCompleteChallenge } = useMutation({
    mutationFn: (challengeData: IPostChallenge) => postChallengeById(token, challengeData),

    onSuccess: (data: any) => {
      if (data && data.balans !== undefined) {
        if (user) {
          handleChangeUserStore({ user: { ...user, coins: data.balans } })
          handleChangeCommonStore({ successfulText: data.message })
        }
      }
    },
    onError: handleError,
  })

  return { completeChallengePartMutate, statusCompleteChallenge }
}

export const useCurrentChallengeDetails = () => {
  const { user } = useUserStore()
  const token = user?.access_token ?? null
  const [challenges, setChallenges] = useState<IChallenge[] | null>(null)
  const { mutate: challengeCurrentDetailsMutate, status } = useMutation({
    mutationFn: () => getCurrentChallengeDetails(token),
    onSuccess: (data: any) => {
      setChallenges(data.challenges)
    },
    onError: handleError,
  })

  return { challengeCurrentDetailsMutate, status, challenges }
}
