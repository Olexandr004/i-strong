import { QuotesDayComponent } from './elements'
import MyComponent from './test'

import { FC, useEffect } from 'react'

import { SectionSwiperComponent } from '@/shared/components'
import { useBackButtonExit } from '@/shared/hooks/useBackButtonExit'
import { useCurrentChallengeDetails } from '@/shared/hooks/useChallengeMutations'

import MoodTrackerComponent from '../../../shared/components/templates/mood-tracker/mood-tracker.component'

import styles from './home.module.scss'

//interface
interface IHome {}

//component
export const HomeComponent: FC<Readonly<IHome>> = () => {
  useBackButtonExit()
  const { challengeCurrentDetailsMutate, status, challenges } = useCurrentChallengeDetails()

  useEffect(() => {
    challengeCurrentDetailsMutate()
  }, [])

  //return
  return (
    <div className={`${styles.home} container`}>
      <h1 className={`${styles.home__title} title`}>Головна</h1>
      {/* <MyComponent /> */}
      <SectionSwiperComponent
        title={'Щоденні челенджі'}
        data={challenges}
        type={'Challenge'}
        status={status}
      />

      <MoodTrackerComponent />

      {/* <SectionSwiperComponent
        title={'Інструкції та інструменти'}
        data={[1, 2]}
        type={'Instructions'}
        status={status}
      /> */}
      <QuotesDayComponent />
    </div>
  )
}
export default HomeComponent
