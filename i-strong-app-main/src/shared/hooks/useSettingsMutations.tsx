import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { useState } from 'react'

import {
  deleteAccount,
  putResetUserPassword,
  putResetUserPin,
  putUpdateUserInfo,
} from '@/api/setting-user.api'

import { useCommonStore, useUserStore } from '../stores'

const handleError = (error: Error) => {
  console.log(`Error: ${error.message}`)
}

export const useSettingPasswordResetRequest = () => {
  const router = useRouter()
  const { user } = useUserStore()
  const token = user?.access_token || ''

  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  const { mutate: passwordReset, status } = useMutation({
    mutationFn: (data: any) => {
      return putResetUserPassword(token, data.new_password)
    },
    onSuccess: (data: any) => {
      router.push('/settings/reset-password')
      handleChangeCommonStore({ successfulText: data.message })
    },
    onError: handleError,
  })
  return { passwordReset, status }
}

export const useSettingResetUserPinRequest = () => {
  const router = useRouter()
  const { user, handleChangeUserStore } = useUserStore()
  const token = user?.access_token || ''

  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { mutate: pinMutation, status } = useMutation({
    mutationFn: (data: any) => {
      return putResetUserPin(token, data.new_password)
    },
    onSuccess: (data: any) => {
      router.push('/settings/reset-password')
      handleChangeCommonStore({ successfulText: data.message })
      if (user) {
        handleChangeUserStore({ user: { ...user, has_dairy_password: true } })
      }
    },
    onError: handleError,
  })
  return { pinMutation, status }
}

export const useSettingUpdateUserInfoRequest = () => {
  const { user, handleChangeUserStore } = useUserStore()
  const token = user?.access_token || ''
  const [userForm, setUserForm] = useState(false)

  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { mutate: updateUserMutation, status } = useMutation({
    mutationFn: (data: any) => {
      const { username, phone_number } = data
      return putUpdateUserInfo(token, username, phone_number)
    },
    onSuccess: (data: any) => {
      const user = data.user
      if (user !== undefined) {
        handleChangeUserStore({ user })
        setUserForm(false)
      }
      handleChangeCommonStore({ successfulText: data.message })
    },
    onError: handleError,
  })
  return { updateUserMutation, status, userForm, setUserForm }
}

export const useDeleteAccount = () => {
  const router = useRouter()
  const { user, handleChangeUserStore } = useUserStore()
  const token = user?.access_token || ''
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const { mutate, status } = useMutation({
    mutationFn: () => {
      return deleteAccount(token)
    },
    onSuccess: (data: any) => {
      handleChangeUserStore({ user: null })
      router.push('/')
      handleChangeCommonStore({ successfulText: data.message })
    },
    onError: handleError,
  })

  return { mutate, status }
}
