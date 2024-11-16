import { QuotesDayComponent } from './elements'
import MyComponent from './test'

import { FC, useEffect } from 'react'

import { SectionSwiperComponent } from '@/shared/components'
import { useBackButtonExit } from '@/shared/hooks/useBackButtonExit'
import { useCurrentChallengeDetails } from '@/shared/hooks/useChallengeMutations'

import MoodTrackerComponent from '../../../shared/components/templates/mood-tracker/mood-tracker.component'
import { AvatarPreviewComponent } from '@/modules/views/profile/elements'

import styles from './home.module.scss'
import Link from 'next/link'
import { IconSos } from '@/shared/icons'

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
      <AvatarPreviewComponent></AvatarPreviewComponent>
      <h1 className={`${styles.home__title} title`}>IStrong</h1>
      <div className={styles.help_block}>
        <h2>Якщо тебе накривають емоції</h2>
        <Link href={'/help'} className={styles.help}>
          <IconSos />
        </Link>
      </div>
      <MoodTrackerComponent />
      {/* <MyComponent /> */}
      <SectionSwiperComponent
        title={'Щоденні челенджі'}
        data={challenges}
        type={'Challenge'}
        status={status}
      />

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
