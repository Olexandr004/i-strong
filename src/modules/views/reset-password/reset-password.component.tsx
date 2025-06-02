import { useSearchParams } from 'next/navigation'

import { FC, useState } from 'react'

import {
  PageHeaderComponent,
  PhoneStepComponent,
  StepCodeVerificationComponent,
  StepNewPassword,
} from '@/shared/components'

import {
  useNewPassword,
  usePasswordResetRequest,
  usePasswordResetVerify,
} from '../../../shared/hooks/useUserMutations'

import styles from './reset-password.module.scss'
import { useTranslation } from 'react-i18next'

interface IResetPassword {}

interface IPhoneData {
  phone_number: string
}

// component
export const ResetPasswordComponent: FC<Readonly<IResetPassword>> = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')
  const [phoneNumber, setPhoneNumber] = useState<IPhoneData>({ phone_number: '' })
  const { mutate: verifyMutate } = usePasswordResetVerify()
  const { mutate: conditionalMutate } = usePasswordResetRequest()
  const { mutate: newPasswordMutate } = useNewPassword()
  const { t } = useTranslation()
  // return
  return (
    <section className={`${styles.reset_password__container} container`}>
      <div className={styles.reset_password__wrap}>
        <PageHeaderComponent title={t('resetPassword.title')} />
        {step === `new-password` && (
          <p className={`${styles.reset_password__text} text_medium`}>
            {t('resetPassword.newPasswordText')}
          </p>
        )}
        {step === null && (
          <p className={`${styles.reset_password__text} text_medium`}>
            {t('resetPassword.phoneText')}
          </p>
        )}
        {step === 'code' && (
          <p className={`${styles.reset_password__text} text_medium`}>
            {t('resetPassword.codeText')}
          </p>
        )}
      </div>

      {step === null && <PhoneStepComponent setPhoneNumber={setPhoneNumber} />}

      {step === 'code' && (
        <StepCodeVerificationComponent
          userInfo={phoneNumber}
          verifyMutate={verifyMutate}
          conditionalMutate={conditionalMutate}
        />
      )}

      {step === 'new-password' && (
        <StepNewPassword
          phoneNumber={phoneNumber}
          mutate={newPasswordMutate}
          namePass={`new-password`}
        />
      )}
    </section>
  )
}

export default ResetPasswordComponent
