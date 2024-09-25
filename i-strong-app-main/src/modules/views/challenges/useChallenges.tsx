import { useEffect } from 'react'

import { ChallengeType } from '@/interfaces/challenge'
import { useChallengesByType } from '@/shared/hooks/useChallengeMutations'
import { useCommonStore } from '@/shared/stores'

const useChallenges = (activeChallengeTypeButton: ChallengeType) => {
  const { challengesByTypeMutate, challenges, statusChallengesByType } = useChallengesByType()

  useEffect(() => {
    challengesByTypeMutate(activeChallengeTypeButton)
    useCommonStore.setState({ activeChallengeTypeButton })
  }, [activeChallengeTypeButton, challengesByTypeMutate])

  return { challenges, statusChallengesByType }
}

export default useChallenges
