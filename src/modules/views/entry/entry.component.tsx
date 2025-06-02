'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { postSignInInfo, postSignUpInfo } from '@/api/entry'
import { ISignUp } from '@/interfaces/entry'
import { ButtonComponent, InputComponent } from '@/shared/components'
import { useBackButtonExit } from '@/shared/hooks/useBackButtonExit'
import { IconBackground, IconInvisible, IconVisible } from '@/shared/icons'
import { useCommonStore, useUserCodeStore, useUserStore } from '@/shared/stores'
import { namePattern, passwordPattern, phoneNumberPattern, required } from '@/shared/validation'
import { useTranslation } from 'react-i18next'

import styles from './entry.module.scss'

//interface
interface IEntry {}

//component
export const EntryComponent: FC<Readonly<IEntry>> = () => {
  useBackButtonExit()
  const router = useRouter()
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { setUserData } = useUserCodeStore()
  const { registerForm, entryType, isAgreedForm } = useCommonStore((state) => ({
    registerForm: state.registerForm,
    entryType: state.entryType,
    isAgreedForm: state.isAgreedForm,
  }))

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
    watch,
  } = useForm<ISignUp>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: registerForm || { username: '', phone_number: '', password: '' },
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const resetForm = () => {
    reset({ username: '', phone_number: '', password: '' })
    handleChangeCommonStore({
      errorText: null,
      registerForm: { username: '', phone_number: '', password: '' },
      isAgreedForm: false,
    })
  }
  const { mutate: postSignUp } = useMutation({
    mutationFn: (form: any) => postSignUpInfo(form),
    onSuccess: (data: any, variables) => {
      resetForm()
      setUserData(variables)
      router.push('sing-up?step=code')
    },
  })

  const { mutate: postSignIn } = useMutation({
    mutationFn: (form: any) => postSignInInfo(form),
    onSuccess: (data: any) => {
      resetForm()
      handleChangeUserStore({ user: data?.user })
      router.push('/')
    },
  })

  const handleSendForm = (data: Partial<ISignUp>) => {
    handleChangeCommonStore({ errorText: null })
    data.phone_number = data.phone_number?.replace(/[^0-9]/g, '')
    entryType === 'signUp' ? postSignUp(data) : postSignIn(data)
  }

  const handleForgetPassword = () => {
    resetForm()
    router.push('/reset-password')
  }

  const { t } = useTranslation()

  useEffect(() => {
    const subscription = watch((value) => {
      handleChangeCommonStore({ registerForm: value })
    })
    return () => subscription.unsubscribe()
  }, [watch, handleChangeCommonStore])

  return (
    <section className={`${styles.entry} container`}>
      <div className={`${styles.entry__background} ${entryType === 'signIn' && styles.sign_in}`}>
        <IconBackground />
      </div>

      <div className={styles.entry__inner}>
        <h1 className={`${styles.entry__title} title`}>
          {entryType === 'signIn' ? t('entry.signInTitle') : t('entry.signUpTitle')}
        </h1>

        <form
          className={styles.entry__form}
          autoComplete={'off'}
          onSubmit={handleSubmit(handleSendForm)}
        >
          <div className={styles.entry__inputs}>
            {entryType === 'signUp' && (
              <Controller
                control={control}
                name={'username'}
                key={`${entryType}-username`}
                defaultValue={registerForm?.username || ''}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <InputComponent
                    value={value || ``}
                    inputId={`${entryType}-username`}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputMode={'text'}
                    label={t('entry.enterName')}
                    error={!!error}
                    placeholder={t('entry.name')}
                    errorText={error?.message}
                  />
                )}
                rules={{
                  required: required,
                  pattern: namePattern,
                }}
              />
            )}

            <Controller
              control={control}
              name={'phone_number'}
              key={`${entryType}-phone_number`}
              defaultValue={registerForm?.phone_number || ''}
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <InputComponent
                  type='tel'
                  inputId={`${entryType}-phone_number`}
                  value={value || ``}
                  key={entryType}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputMode={'tel'}
                  label={t('entry.enterPhone')}
                  placeholder={t('entry.phone')}
                  error={!!error}
                  errorText={error?.message}
                  withMask
                />
              )}
              rules={{ required: required, pattern: phoneNumberPattern }}
            />

            <div
              className={
                entryType === 'signIn' ? `${styles.entry__last}` : `${styles.entry__last_input}`
              }
            >
              <Controller
                control={control}
                name={'password'}
                defaultValue={registerForm?.password || ''}
                key={`${entryType}-password`}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <InputComponent
                    inputId={`${entryType}-password`}
                    value={value || ``}
                    onBlur={onBlur}
                    onChange={onChange}
                    type={isPasswordVisible ? 'text' : 'password'}
                    label={
                      entryType === 'signUp' ? t('entry.createPassword') : t('entry.enterPassword')
                    }
                    placeholder={t('entry.password')}
                    inputMode={'text'}
                    hint={entryType === 'signUp' ? t('entry.passwordHint') : undefined}
                    key={entryType}
                    error={!!error}
                    errorText={error?.message}
                    sideAction={() => setIsPasswordVisible(!isPasswordVisible)}
                    icon={isPasswordVisible ? <IconInvisible /> : <IconVisible />}
                  />
                )}
                rules={{
                  required: required,
                  pattern: entryType === 'signUp' ? passwordPattern : undefined,
                }}
              />
              {entryType === 'signUp' && (
                <div className={styles.entry__agreement}>
                  <input
                    type='checkbox'
                    id='agreement'
                    checked={isAgreedForm}
                    onChange={() =>
                      handleChangeCommonStore({
                        isAgreedForm: !isAgreedForm,
                      })
                    }
                  />
                  <label htmlFor='agreement' className='text-4'>
                    {t('entry.agreeText')}{' '}
                    <Link href={'privacy-policy'}>{t('entry.privacyPolicy')}</Link>
                  </label>
                </div>
              )}
              {entryType === 'signIn' && (
                <button
                  type={'button'}
                  onClick={handleForgetPassword}
                  className={styles.entry__forget_btn}
                >
                  {t('entry.forgotPassword')}
                </button>
              )}
            </div>
          </div>

          <div className={styles.entry__actions}>
            <ButtonComponent
              type={'submit'}
              disabled={!isValid || (entryType === 'signUp' && !isAgreedForm)}
            >
              {entryType === 'signIn' ? t('entry.signInButton') : t('entry.signUpButton')}
            </ButtonComponent>

            <div className={styles.entry__navigation}>
              {entryType === 'signIn' ? t('entry.notRegistered') : t('entry.alreadyRegistered')}
              <button
                type={'button'}
                onClick={() => {
                  resetForm()
                  useCommonStore.setState({
                    entryType: entryType === 'signIn' ? 'signUp' : 'signIn',
                  })
                }}
                className={styles.entry__sign_in}
              >
                {entryType === 'signIn' ? t('entry.signUpButton') : t('entry.signInButton')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
export default EntryComponent
