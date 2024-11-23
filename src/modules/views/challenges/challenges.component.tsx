import React, { FC, memo, useRef, useState } from 'react'
import Link from 'next/link'
import { IconGuides } from '@/shared/icons'
import useChallenges from './useChallenges'
import useChallengeButtons from './useChallengesButtonsBar'
import { ChallengeType, IChallenge } from '@/interfaces/challenge'
import {
  ButtonBarComponent,
  ModalGettingToInstructionsComponent,
  PageHeaderComponent,
  ScrollToTopButtonComponent,
  SliderCardComponent,
} from '@/shared/components'
import { useCommonStore, useUserStore } from '@/shared/stores'
import styles from './challenges.module.scss'

interface IChallengesComponent {}

export const ChallengesComponent: FC<Readonly<IChallengesComponent>> = () => {
  const shopContainerRef = useRef(null)
  const { activeChallengeTypeButton, handleButtonClick, buttonInfos } = useChallengeButtons()
  const { challenges, statusChallengesByType } = useChallenges(activeChallengeTypeButton)

  const { isModalActive, modalContent, handleChangeCommonStore } = useCommonStore((state) => ({
    isModalActive: state.isModalActive,
    modalContent: state.modalContent,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))

  const [guideImages, setGuideImages] = useState<string[]>([]) // Состояние для изображений
  const token = useUserStore((state) => state.user?.access_token)
  const fetchGuideImages = async (guideType: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/guides/${guideType}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен авторизации
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      console.log('Fetched guide data:', data) // Логируем полный ответ от сервера для диагностики

      // Обращаемся к правильному полю в ответе
      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setGuideImages(images) // Сохраняем только ссылки на изображения
      } else {
        console.error('Images are not an array or not found:', data.guide?.images)
      }
    } catch (error) {
      console.error('Error fetching guide images:', error)
    }
  }
  // Обработчик клика для IconGuides
  const handleIconGuidesClick = () => {
    console.log('IconGuides clicked!') // Для отладки
    handleChangeCommonStore({ isModalActive: true, modalContent: 'challenges' })
    fetchGuideImages('challenges') // Получаем изображения для типа "challenges"
  }

  return (
    <section className={`${styles.challenge}`}>
      <div ref={shopContainerRef} className={styles.challenge__scroll}>
        <PageHeaderComponent title='Челенджі' />

        {/* Кнопка IconGuides с обработчиком клика */}
        <div className={styles.iconGuides} onClick={handleIconGuidesClick}>
          <IconGuides />
        </div>

        <ButtonBarComponent
          buttons={buttonInfos}
          onButtonClick={(id: string) => handleButtonClick(id as ChallengeType)}
        />
        <div className={`gallery ${styles.challenge__gallery}`}>
          {statusChallengesByType === 'pending' ? (
            <div>Loading...</div>
          ) : (
            challenges?.map((challenge: IChallenge) =>
              activeChallengeTypeButton === 'completed' && challenge.is_completed ? (
                <div key={challenge.id} className={styles.challenge__slide}>
                  <SliderCardComponent slide={challenge} />
                </div>
              ) : (
                <Link key={challenge.id} href={`/challenge?id=${challenge.id}`}>
                  <SliderCardComponent slide={challenge} />
                </Link>
              ),
            )
          )}
        </div>
      </div>

      <ScrollToTopButtonComponent scrollContainerRef={shopContainerRef} />

      {/* Модальное окно, управляемое состоянием */}
      <ModalGettingToInstructionsComponent
        title='Челенджі - основне джерело заробітку монеток, виконуй завдання кожного дня щоб ставати краще'
        images={guideImages} // Передаем все изображения
        check='challenges'
        isModalActive={isModalActive}
        closeModal={() => handleChangeCommonStore({ isModalActive: false })}
      />
    </section>
  )
}

export default memo(ChallengesComponent)
