import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'

import { ChallengeType } from '@/interfaces/challenge'
import { useCommonStore } from '@/shared/stores'
import i18n from 'i18next'

const t = i18n.t

const useChallengeButtons = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const path = searchParams.get('path') as ChallengeType
  const { activeChallengeTypeButton, handleChangeCommonStore } = useCommonStore((state) => ({
    activeChallengeTypeButton: state.activeChallengeTypeButton,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))

  useEffect(() => {
    if (path) {
      handleChangeCommonStore({ activeChallengeTypeButton: path })
    }
  }, [path, handleChangeCommonStore])

  const handleButtonClick = (buttonKey: ChallengeType) => {
    handleChangeCommonStore({ activeChallengeTypeButton: buttonKey })
    router.push(`/challenges?path=${buttonKey}`)
  }

  const buttonInfos = [
    { id: 'new', text: t('new'), isActive: activeChallengeTypeButton === 'new' },
    {
      id: 'in_progress',
      text: t('inProgress'),
      isActive: activeChallengeTypeButton === 'in_progress',
    },
    { id: 'completed', text: t('completed'), isActive: activeChallengeTypeButton === 'completed' },
  ]

  return {
    activeChallengeTypeButton,
    handleButtonClick,
    buttonInfos,
  }
}

export default useChallengeButtons
