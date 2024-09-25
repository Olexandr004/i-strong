'use client'

import { CSSProperties, FC, ReactNode } from 'react'
import {
  Control,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  UseFormRegister,
} from 'react-hook-form'

interface IForm {
  onChange?: (e: any) => void
  onSubmit: (e: any) => void
  defaultValues?: any
  formMethods: (props: {
    isValid: boolean
    register: UseFormRegister<FieldValues>
    errors: FieldErrors
    getValues: (name: string) => string
    control: Control
    setValue: (
      name: string,
      value: string,
      options?:
        | Partial<{
            shouldValidate: boolean
            shouldDirty: boolean
            shouldTouch: boolean
          }>
        | undefined,
    ) => void
  }) => ReactNode
  autoComplete?: 'on' | 'off'
  className?: string
  style?: CSSProperties
}

// component
export const FormComponent: FC<Readonly<IForm>> = ({
  autoComplete = 'off',
  className,
  style,
  onSubmit,
  onChange,
  formMethods,
}) => {
  const { handleSubmit, formState, register, setValue, getValues, control } = useFormContext()

  // return
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={onChange}
      className={className}
      style={style}
      autoComplete={autoComplete}
    >
      {formMethods({
        isValid: formState.isValid,
        register,
        errors: formState.errors,
        getValues,
        setValue,
        control,
      })}
    </form>
  )
}

// provider
export const FormSubmitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const methods = useForm({
    mode: 'onSubmit',
  })

  // Return
  return <FormProvider {...methods}>{children}</FormProvider>
}
