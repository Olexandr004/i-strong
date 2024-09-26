import { TimerButton } from './elements/timer-button.component'

import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AuthFormComponent, InputCodeComponent } from '@/shared/components'
import { required } from '@/shared/validation'

interface IStepCodeVerification {
  userInfo: any
  verifyMutate: (data: any) => void
  conditionalMutate: (data: any) => void
}

interface ICodeData {
  code: string
}

const StepCodeVerificationComponent: FC<IStepCodeVerification> = ({
  userInfo,
  verifyMutate,
  conditionalMutate,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<ICodeData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const handleCodeVerificationSubmit = (data: ICodeData) => {
    const phone = {
      phone: userInfo?.phone_number,
    }
    verifyMutate({ ...data, ...phone })
  }

  const handleNewRequest = () => {
    conditionalMutate({ ...userInfo })
  }

  return (
    <AuthFormComponent
      onSubmit={handleSubmit(handleCodeVerificationSubmit)}
      textButton='Далі'
      isFormValid={isValid}
      timer={<TimerButton initialTime={60} onButtonClick={handleNewRequest} />}
    >
      <Controller
        control={control}
        name='code'
        render={({ field: { value, onChange } }) => (
          <InputCodeComponent length={4} value={value} onChange={onChange} />
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
  )
}

export default StepCodeVerificationComponent
