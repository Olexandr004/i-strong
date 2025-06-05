'use client'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent, PageHeaderComponent } from '@/shared/components'
import { useUserStore } from '@/shared/stores'

import styles from './privacy-policy.module.scss'
import { useTranslation } from 'react-i18next'

//interface
interface ISettings {}

//component
export const PrivacyPolicyComponent: FC<Readonly<ISettings>> = () => {
  const { user } = useUserStore()
  const router = useRouter()
  const { t } = useTranslation()

  const handle = () => {
    if (user) {
      return router.push('/profile')
    }
    router.push('/')
  }
  //return
  return (
    <section className={`${styles.privacy} container`}>
      <PageHeaderComponent title={t('privacyPage.title')} />

      <p className='text-4'>{t('privacyPage.text1')}</p>
      <h2 className='text-3'>{t('privacyPage.title1')}</h2>
      <p className='text-4'>{t('privacyPage.text2')}</p>
      <h2 className='text-3'>{t('privacyPage.title2')}</h2>
      <p className='text-4'>{t('privacyPage.text3')}</p>
      <h2 className='text-3'>{t('privacyPage.title3')}</h2>
      <p className='text-4'>{t('privacyPage.text4')}</p>
      <h2 className='text-3'>{t('privacyPage.title4')}</h2>
      <p className='text-4'>{t('privacyPage.text5')}</p>
      <h2 className='text-3'>{t('privacyPage.title5')}</h2>
      <p className='text-4'>{t('privacyPage.text6')}</p>
      <h2 className='text-3'>{t('privacyPage.title6')}</h2>
      <p className='text-4'>{t('privacyPage.text7')}</p>
      <h2 className='text-3'>{t('privacyPage.title7')}</h2>
      <p className='text-4'>{t('privacyPage.text8')}</p>
      <h2 className='text-3'>{t('privacyPage.title8')}</h2>
      <p className='text-4'>{t('privacyPage.text9')}</p>
      <h2 className='text-3'>{t('privacyPage.title9')}</h2>
      <p className='text-4'>{t('privacyPage.text10')}</p>
      <h2 className='text-3'>{t('privacyPage.title10')}</h2>
      <p className='text-4'>{t('privacyPage.text11')}</p>
      <h2 className='text-3'>{t('privacyPage.title11')}</h2>
      <p className='text-4'>{t('privacyPage.text12')}</p>
      <h2 className='text-3'>{t('privacyPage.title12')}</h2>
      <p className='text-4'>{t('privacyPage.text13')}</p>
      <h2 className='text-3'>{t('privacyPage.title13')}</h2>
      <p className='text-4'>{t('privacyPage.text14')}</p>
      <h2 className='text-3'>{t('privacyPage.title14')}</h2>
      <p className='text-4'>{t('privacyPage.text15')}</p>
      <h2 className='text-3'>{t('privacyPage.title15')}</h2>
      <p className='text-4'>{t('privacyPage.text16')}</p>
      <div className={styles.privacy__position}>
        <ButtonComponent onClick={handle}>{t('privacyPage.btn')}</ButtonComponent>
      </div>
    </section>
  )
}
export default PrivacyPolicyComponent
