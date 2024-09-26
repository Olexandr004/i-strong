import { FC } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { IPinCodeData } from '@/interfaces/user'
import { AuthFormComponent, InputCodeComponent, PageHeaderComponent } from '@/shared/components'
import { required } from '@/shared/validation'

import styles from './diary-pin-code.module.scss'

//interface
interface IDiaryPinCodeComponent {
  onVerify: (data: IPinCodeData) => void
}

//component
const DiaryPinCodeComponent: FC<IDiaryPinCodeComponent> = ({ onVerify }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IPinCodeData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const handleCodeVerificationSubmit: SubmitHandler<IPinCodeData> = (data) => {
    onVerify(data)
  }

  //return
  return (
    <section className={`${styles.diary} container`}>
      <PageHeaderComponent title='Введи пароль' />
      <AuthFormComponent
        onSubmit={handleSubmit(handleCodeVerificationSubmit)}
        textButton='Далі'
        isFormValid={isValid}
      >
        <Controller
          control={control}
          name='dairy_password'
          render={({ field: { value, onChange } }) => (
            <InputCodeComponent
              length={4}
              value={value}
              onChange={(newValue: string) => onChange(newValue)}
            />
          )}
          rules={{
            required: required,
            minLength: {
              value: 4,
              message: '',
            },
          }}
        />
      </AuthFormComponent>
    </section>
  )
}
export default DiaryPinCodeComponent
