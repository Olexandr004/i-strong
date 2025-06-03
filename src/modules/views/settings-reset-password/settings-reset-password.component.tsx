import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'

import { ButtonComponent, PageHeaderComponent, StepNewPassword } from '@/shared/components'
import { useSettingPasswordResetRequest } from '@/shared/hooks/useSettingsMutations'

import styles from './settings-reset-password.module.scss'
import { useTranslation } from 'react-i18next'

interface IResetPassword {}

export const SettingsResetPasswordComponent: FC<Readonly<IResetPassword>> = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')
  const { t } = useTranslation()

  const { passwordReset } = useSettingPasswordResetRequest()
  const router = useRouter()

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
        <PageHeaderComponent title={t('reset_password.title')} />

        {step === `new-password` && (
          <p className={`${styles.reset_password__text} text_medium`}>
            {t('reset_password.new_password_text')}
          </p>
        )}
      </div>

      {step === null && (
        <div className={`${styles.reset}`}>
          <div className={`${styles.reset__block}`}>
            <p className={`${styles.reset__block_text} text-3-gray`}>
              {t('reset_password.login_password')}
            </p>
            <ButtonComponent onClick={handlePushNewPass} variant={'outlined'}>
              {t('reset_password.change')}
            </ButtonComponent>
          </div>

          <ButtonComponent onClick={handlePushSetting}>{t('reset_password.save')}</ButtonComponent>
        </div>
      )}

      {step === 'new-password' && (
        <StepNewPassword mutate={passwordReset} namePass={`new-password`} />
      )}
    </section>
  )
}

export default SettingsResetPasswordComponent
