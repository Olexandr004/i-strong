'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent, PageHeaderComponent } from '@/shared/components'
import { useDeleteAccount } from '@/shared/hooks/useSettingsMutations'
import { ImageCapybaraDeletion } from '@/shared/images'

import styles from './account-deletion.module.scss'
import { useTranslation } from 'react-i18next'

//interface
interface ISettings {}

//component
export const AccountDeletionComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()
  const { mutate } = useDeleteAccount()
  const { t } = useTranslation()

  const handleUserDelete = () => {
    mutate()
  }

  const handleNotUserDelete = () => {
    router.push('/settings')
  }

  //return
  return (
    <section className={`${styles.account_deletion} container`}>
      <div>
        <PageHeaderComponent title={t('diaryPage.delete_account_confirm')} gapSize={`large`} />
        <p className={`${styles.account_deletion__text} text-4-grey`}>
          (Можна відновити протягом 6 місяців)
        </p>
      </div>
      <Image
        src={ImageCapybaraDeletion}
        alt={`CapybaraDeletion`}
        className={styles.account_deletion__img}
        priority
      />
      <div className={styles.account_deletion__btn_wrap}>
        <ButtonComponent variant={'outlined'} onClick={handleUserDelete}>
          {t('storePage.yes')}
        </ButtonComponent>
        <ButtonComponent onClick={handleNotUserDelete}>{t('storePage.no')}</ButtonComponent>
      </div>
    </section>
  )
}
export default AccountDeletionComponent
