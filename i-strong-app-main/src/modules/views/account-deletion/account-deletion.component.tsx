'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent, PageHeaderComponent } from '@/shared/components'
import { useDeleteAccount } from '@/shared/hooks/useSettingsMutations'
import { ImageCapybaraDeletion } from '@/shared/images'

import styles from './account-deletion.module.scss'

//interface
interface ISettings {}

//component
export const AccountDeletionComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()
  const { mutate } = useDeleteAccount()

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
        <PageHeaderComponent
          title={'Ти впевнений(-а), що хочеш видалити аккаунт?'}
          gapSize={`large`}
        />
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
          Так
        </ButtonComponent>
        <ButtonComponent onClick={handleNotUserDelete}>Ні</ButtonComponent>
      </div>
    </section>
  )
}
export default AccountDeletionComponent
