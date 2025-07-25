'use client'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useState } from 'react'

import { request } from '@/api/useRequest'
import { ISignIn } from '@/interfaces/entry'
import { IPinCodeData } from '@/interfaces/user'
import { useUserStore } from '@/shared/stores'

export const useGetTrackerRecords = () => {
  const { user } = useUserStore()
  const token = user?.access_token || ''

  const queryFn = async () => {
    const response = await fetch(`https://istrongapp.com/api/users/diary/tracker/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json() // Верните данные напрямую
  }

  return useQuery({
    queryKey: ['getTrackerRecords'],
    queryFn,
    enabled: !!token, // Запрос выполняется только при наличии токена
  })
}
export const postDiaryRecord = (form: ISignIn, token: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/`, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateDiaryRecord = (form: ISignIn, token: string, note_id: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/${note_id}/`, {
    method: 'PUT',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const postDeleteRecord = (note_id: string, token: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/${note_id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetDiaryRecords = (token: string) => {
  return useQuery({ queryKey: ['getDiaryRecords'], queryFn: () => getDiaryRecords(token) })
}

export const getDiaryRecords = async (
  token: string,
): Promise<{ notes: { year: number; months: any[] }[]; has_note_today: boolean }> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetSingleRecord = (token: string, record_id: string) => {
  return useQuery({
    queryKey: ['getSingleDiaryRecord'],
    queryFn: () => getSingleRecord(token, record_id),
    enabled: false,
  })
}

export const getSingleRecord = async (
  token: string,
  record_id: string,
): Promise<{
  id: number
  title: string
  note: string
  created_at: string
}> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/${record_id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetRecordsByDate = (token: string, year: string, month: string) => {
  return useQuery({
    queryKey: ['getRecordsByDate'],
    queryFn: () => getRecordsByDate(token, year, month),
    enabled: false,
  })
}

export const getRecordsByDate = async (
  token: string,
  year: string,
  month: string,
): Promise<{ notes: { id: number; title: string; note: string; created_at: string }[] }> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/main/by-date/${year}/${month}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const postCheckPinCode = async (token: string, pinCodeData: IPinCodeData) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/diary/check-password/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: pinCodeData,
  })
}

export const useCheckPinCode = () => {
  const { user } = useUserStore()
  const userPassword = useUserStore((state) => state?.user?.has_dairy_password)
  const [isPinVerified, setIsPinVerified] = useState(false)

  const passShow = userPassword && !isPinVerified

  const token = user?.access_token || ''
  const { mutate: mutateCheckPinCode, status } = useMutation({
    mutationFn: (pinCodeData: IPinCodeData) => {
      return postCheckPinCode(token, pinCodeData)
    },
    onSuccess: (data: any) => {
      setIsPinVerified(data)
    },
    onError: (error: Error) => {
      console.log(`Error: ${error.message}`)
    },
  })
  return { mutateCheckPinCode, status, passShow, isPinVerified, setIsPinVerified }
}

export const postAddToFavorites = async (
  noteId: number,
  type: 'main' | 'tracker' | 'challenges',
  token: string,
) => {
  console.log('Adding to favorites:', { noteId, type, token }) // Логирование данных
  const response = await fetch('https://istrongapp.com/api/users/favorites/diary/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note_id: noteId, type }),
  })

  if (!response.ok) {
    const errorData = await response.json() // Получаем тело ответа при ошибке
    console.error('Error response:', errorData) // Логируем ошибку
    throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

export const deleteFromFavorites = async (noteId: number, type: string, token: string) => {
  console.log('Deleting from favorites:', { noteId, type, token }) // Log the data being sent
  const response = await fetch(
    `https://istrongapp.com/api/users/favorites/diary/${noteId}/${type}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json() // Get response body for error details
    console.error('Error response:', errorData) // Log error response
    throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorData)}`)
  }

  return response.text() // Since the body is empty, return text
}
