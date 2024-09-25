import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import {
  postNewPassword,
  postPasswordReset,
  postPasswordResetVerifyCode,
  postSignUpInfo,
  postVerifyCode,
} from '@/api/entry'
import { ISignUp } from '@/interfaces/entry'
import { useCommonStore, useUserCodeStore, useUserStore } from '@/shared/stores'

interface IVerifyCode {
  phone: string
  code: string
}

interface IPasswordReset {
  phone_number: string
}

interface ICleanedData {
  phone_number: string
  confirmation_code?: string
}

interface IPasswordChange {
  phone_number: string
  new_password: string
}

const cleanPhoneNumber = (phone: string): string => phone.replace(/[^0-9]/g, '')

const handleError = (error: Error) => {
  console.log(`Error: ${error.message}`)
}

export const useRegisterRequest = () => {
  const router = useRouter()
  const { mutate, status } = useMutation({
    mutationFn: (data: ISignUp) => {
      return postSignUpInfo(data)
    },
    onSuccess: () => {
      router.push('/sing-up?step=code')
    },
    onError: handleError,
  })
  return { mutate, status }
}

export const useRegisterVerifyCode = () => {
  const router = useRouter()
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const { clearUserData } = useUserCodeStore()
  const { mutate, status } = useMutation({
    mutationFn: (data: IVerifyCode) => {
      const cleanedData = {
        confirmation_code: data.code,
        phone_number: cleanPhoneNumber(data.phone),
      }
      return postVerifyCode(cleanedData)
    },
    onSuccess: (data: any) => {
      router.push('/welcome')
      handleChangeUserStore({ user: data?.user })
      clearUserData()
    },
    onError: handleError,
  })
  return { mutate, status }
}

export const usePasswordResetRequest = () => {
  const router = useRouter()
  const { mutate, status } = useMutation({
    mutationFn: (data: IPasswordReset) => {
      const cleanedData: ICleanedData = {
        phone_number: cleanPhoneNumber(data.phone_number),
      }

      return postPasswordReset(cleanedData)
    },
    onSuccess: () => {
      router.push('/reset-password?step=code')
    },
    onError: handleError,
  })
  return { mutate, status }
}

export const usePasswordResetVerify = () => {
  const router = useRouter()
  const { mutate, status } = useMutation({
    mutationFn: (data: IVerifyCode) => {
      const cleanedData = {
        confirmation_code: data.code,
        phone_number: cleanPhoneNumber(data.phone),
      }
      return postPasswordResetVerifyCode(cleanedData)
    },
    onSuccess: () => {
      router.push('/reset-password?step=new-password')
    },
    onError: handleError,
  })
  return { mutate, status }
}

export const useNewPassword = () => {
  const router = useRouter()
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { mutate, status } = useMutation({
    mutationFn: (data: IPasswordChange) => {
      const cleanedData = {
        phone_number: cleanPhoneNumber(data.phone_number),
        new_password: data.new_password,
      }

      return postNewPassword(cleanedData)
    },
    onSuccess: (data: any) => {
      router.push('/')
      handleChangeCommonStore({ successfulText: data.message })
    },
    onError: handleError,
  })

  return { mutate, status }
}
