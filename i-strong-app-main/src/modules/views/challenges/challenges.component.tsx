import Link from 'next/link'

import useChallenges from './useChallenges'
import useChallengeButtons from './useChallengesButtonsBar'

import { FC, memo, useRef } from 'react'

import { ChallengeType, IChallenge } from '@/interfaces/challenge'
import {
  ButtonBarComponent,
  ModalGettingToInstructionsComponent,
  PageHeaderComponent,
  ScrollToTopButtonComponent,
  SliderCardComponent,
} from '@/shared/components'
import { ImageCapybaraTeacher } from '@/shared/images'

import styles from './challenges.module.scss'

//interface
interface IChallengesComponent {}

//component
export const ChallengesComponent: FC<Readonly<IChallengesComponent>> = () => {
  const shopContainerRef = useRef(null)
  const { activeChallengeTypeButton, handleButtonClick, buttonInfos } = useChallengeButtons()
  const { challenges, statusChallengesByType } = useChallenges(activeChallengeTypeButton)

  //return
  return (
    <section className={`${styles.challenge}`}>
      <div ref={shopContainerRef} className={styles.challenge__scroll}>
        <PageHeaderComponent title='Челенджі' />
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

      <ModalGettingToInstructionsComponent
        title='Челенджі - основне джерело заробітку монеток, виконуй завдання кожного дня щоб ставати краще'
        image={ImageCapybaraTeacher}
        buttonText='Домовились!'
        check={`challenges`}
      />
    </section>
  )
}
export default memo(ChallengesComponent)
