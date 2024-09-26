import { useRouter, useSearchParams } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent, PageHeaderComponent, StepNewPassword } from '@/shared/components'
import {
  useSettingPasswordResetRequest,
  useSettingResetUserPinRequest,
} from '@/shared/hooks/useSettingsMutations'

import styles from './settings-reset-password.module.scss'

interface IResetPassword {}

// component
export const SettingsResetPasswordComponent: FC<Readonly<IResetPassword>> = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const { pinMutation } = useSettingResetUserPinRequest()
  const { passwordReset } = useSettingPasswordResetRequest()

  const router = useRouter()
  const handle = () => {
    router.push('reset-password?step=new-pin-code')
  }

  const handlePushNewPass = () => {
    router.push('reset-password?step=new-password')
  }

  const handlePushSetting = () => {
    router.push('/settings')
  }

  // return
  return (
    <section className={`${styles.reset_password__container} container`}>
      <div className={styles.reset_password__wrap}>
        <PageHeaderComponent title={step === `passwords` ? `Конфіденційність` : 'Зміна пароля'} />

        {step === `new-password` && (
          <p className={`${styles.reset_password__text} text_medium`}>
            Придумай новий пароль для входу
          </p>
        )}
        {step === 'new-pin-code' && (
          <p className={`${styles.reset_password__text} text_medium`}>
            Придумай новий пароль для щоденника
          </p>
        )}
      </div>

      {step === null && (
        <>
          <div className={`${styles.reset}`}>
            <div className={`${styles.reset__block}`}>
              <p className={`${styles.reset__block_text} text-3-gray`}>Пароль для входу</p>
              <ButtonComponent onClick={handlePushNewPass} variant={'outlined'}>
                Змінити
              </ButtonComponent>
            </div>
            <div>
              <p className={`${styles.reset__block_text} text-3-gray`}>Пароль для щоденника</p>
              <ButtonComponent onClick={handle} variant={'outlined'}>
                Змінити
              </ButtonComponent>
            </div>
          </div>

          <ButtonComponent onClick={handlePushSetting}>Зберегти</ButtonComponent>
        </>
      )}

      {step === 'new-password' && (
        <StepNewPassword mutate={passwordReset} namePass={`new-password`} />
      )}

      {step === 'new-pin-code' && (
        <StepNewPassword mutate={pinMutation} namePass={`new-pin-code`} />
      )}
    </section>
  )
}

export default SettingsResetPasswordComponent
