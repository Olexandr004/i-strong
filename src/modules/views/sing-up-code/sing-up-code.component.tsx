'use client'
import { FC } from 'react'

import { PageHeaderComponent, StepCodeVerificationComponent } from '@/shared/components'
import { useUserCodeStore } from '@/shared/stores'

import { useRegisterRequest, useRegisterVerifyCode } from '../../../shared/hooks/useUserMutations'

import styles from './sing-up-code.module.scss'

interface IResetPassword {}

export const SingUpCodeComponent: FC<Readonly<IResetPassword>> = () => {
  const { mutate: verifyRegisteMutate } = useRegisterVerifyCode()
  const { mutate: RegisteMutate } = useRegisterRequest()
  const { userData } = useUserCodeStore()

  return (
    <section className={`${styles.sing_up_code__container} container`}>
      <div className={styles.sing_up_code__wrap}>
        <PageHeaderComponent title='Реєстрація' gapSize={'large'} />
        <p className={`${styles.sing_up_code__text} text_medium`}>
          Введи код, який ми надіслали тобі у повідомлення для реєстрації
        </p>
      </div>

      <StepCodeVerificationComponent
        userInfo={userData}
        verifyMutate={verifyRegisteMutate}
        conditionalMutate={RegisteMutate}
      />
    </section>
  )
}

export default SingUpCodeComponent
