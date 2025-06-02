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
import { useTranslation } from 'react-i18next'

//interface
interface IHome {}

//component
export const HomeComponent: FC<Readonly<IHome>> = () => {
  useBackButtonExit()
  const { challengeCurrentDetailsMutate, status, challenges } = useCurrentChallengeDetails()
  const { t } = useTranslation()
  useEffect(() => {
    challengeCurrentDetailsMutate()
  }, [])

  //return
  return (
    <div className={`${styles.home} container`}>
      <AvatarPreviewComponent></AvatarPreviewComponent>
      <h1 className={`${styles.home__title} title`}>IStrong</h1>
      <div className={styles.help_block}>
        <h2>{t('home.helpTitle')}</h2>
        <Link href={'/help'} className={styles.help}>
          <IconSos />
        </Link>
      </div>
      <MoodTrackerComponent />
      {/* <MyComponent /> */}
      <SectionSwiperComponent
        title={t('home.dailyChallenges')}
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
