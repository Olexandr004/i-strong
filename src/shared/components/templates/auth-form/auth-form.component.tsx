import React, { ReactNode } from 'react'

import { ButtonComponent } from '../../ui'

import styles from './auth-form.module.scss'

interface IAuthForm {
  onSubmit: (data: any) => void
  textButton: string
  children: ReactNode
  isFormValid?: boolean
  timer?: ReactNode
}

const AuthFormComponent: React.FC<IAuthForm> = ({
  onSubmit,
  children,
  textButton,
  isFormValid,
  timer,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.form__wrap}>{children}</div>

      <div className={styles.form__wrap_btn}>
        {timer}

        <ButtonComponent disabled={!isFormValid} type='submit'>
          {textButton}
        </ButtonComponent>
      </div>
    </form>
  )
}

export default AuthFormComponent
