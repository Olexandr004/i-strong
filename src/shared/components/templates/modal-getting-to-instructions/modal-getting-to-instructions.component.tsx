import Image, { StaticImageData } from 'next/image'

import React, { useEffect } from 'react'

import { useUserActivities } from '@/api/user.api'
import { BaseModalComponent, ButtonComponent, CoinsDisplayComponent } from '@/shared/components'
import { ImageCapybara } from '@/shared/images'
import { useCommonStore, useUserStore } from '@/shared/stores'

import styles from './modal-getting-to-instructions.module.scss'

interface UserActivity {
  challenges_visited: boolean
  shop_visited: boolean
  diary_visited: boolean
  instructions_visited: boolean
  mood_stats_visited: boolean
  id: number
}

type ActivityCheck = 'challenges' | 'shop' | 'diary' | 'instructions' | 'mood-stats'

const shouldShowModal = (userActivity: UserActivity | undefined, check: ActivityCheck): boolean => {
  if (!userActivity) {
    return false
  }
  const activityKeyMap: { [key in ActivityCheck]: keyof UserActivity } = {
    challenges: 'challenges_visited',
    shop: 'shop_visited',
    diary: 'diary_visited',
    instructions: 'instructions_visited',
    'mood-stats': 'mood_stats_visited',
  }

  const activityKey = activityKeyMap[check]

  return !userActivity[activityKey]
}

interface IModalGettingToInstructionsComponent {
  title: string
  image?: StaticImageData
  buttonText: string
  coin?: boolean
  check: ActivityCheck
}

export const ModalGettingToInstructionsComponent: React.FC<
  IModalGettingToInstructionsComponent
> = ({ title, image, buttonText, coin, check }) => {
  const userActivity = useUserStore((state) => state.user?.activity)
  const { mutateUserActivities } = useUserActivities()

  const handleConfirmation = () => {
    useCommonStore.setState({ isModalActive: false })
    mutateUserActivities(check)
  }

  const showModal = shouldShowModal(userActivity, check)
  useEffect(() => {
    if (showModal) {
      useCommonStore.setState({ isModalActive: true })
    }
  }, [showModal])
  return (
    <>
      {showModal && (
        <BaseModalComponent>
          <div className={styles.modal}>
            <div className={`${styles.modal__wrap} text-3`}>
              <h2 className={`${styles.modal__wrap_text} text-3`}>{title}</h2>
              {coin && <CoinsDisplayComponent coin={1} />}
            </div>
            <div className={styles.modal__image}>
              <Image
                src={image || ImageCapybara}
                alt='Modal Image'
                className={styles.modal__top_img}
                sizes='90vw'
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                priority
              />
            </div>

            <ButtonComponent onClick={handleConfirmation}>{buttonText}</ButtonComponent>
          </div>
        </BaseModalComponent>
      )}
    </>
  )
}

export default ModalGettingToInstructionsComponent
