import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AuthFormComponent, InputComponent } from '@/shared/components'
import { usePasswordResetRequest } from '@/shared/hooks/useUserMutations'
import { phoneNumberPattern, required } from '@/shared/validation'
import { useTranslation } from 'react-i18next'

interface IPhoneStep {
  setPhoneNumber: (phoneNumber: IPhoneData) => void
}

interface IPhoneData {
  phone_number: string
}

const PhoneStepComponent: FC<IPhoneStep> = ({ setPhoneNumber }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IPhoneData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })
  const { mutate } = usePasswordResetRequest()
  const { t } = useTranslation()

  const handlePhone = (data: IPhoneData) => {
    mutate(data)
    setPhoneNumber({ ...data })
  }

  return (
    <AuthFormComponent onSubmit={handleSubmit(handlePhone)} textButton='Далі' isFormValid={isValid}>
      <Controller
        control={control}
        name='phone_number'
        key={'phones'}
        rules={{
          required: required,
          pattern: phoneNumberPattern,
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <InputComponent
            value={value || ''}
            inputId='phone_number'
            label={t('entry.enterPhone')}
            placeholder={t('entry.phone')}
            key={'phone_number'}
            onChange={onChange}
            onBlur={onBlur}
            inputMode='tel'
            type='tel'
            error={!!error}
            errorText={error?.message}
          />
        )}
      />
    </AuthFormComponent>
  )
}

export default PhoneStepComponent
