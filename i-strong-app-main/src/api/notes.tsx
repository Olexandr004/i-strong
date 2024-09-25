import { useQuery } from '@tanstack/react-query'

import { useRequest } from '@/api/useRequest'
import { ISignIn } from '@/interfaces/entry'

export const useGetNotes = (token: string) => {
  return useQuery({ queryKey: ['getNotes'], queryFn: () => getNotes(token) })
}

export const getNotes = async (token: string): Promise<{ notes: any[] }> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/diary/notes/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetAllNotesByChallenge = (token: string, id: string) => {
  return useQuery({
    queryKey: ['getAllNotesByChallenge'],
    queryFn: () => getAllNotesByChallenge(token, id),
    enabled: false,
  })
}

export const getAllNotesByChallenge = async (
  token: string,
  id: string,
): Promise<{ notes: any[] }> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/diary/notes/by-challenge/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetSingleNote = (token: string, note_id: string) => {
  return useQuery({
    queryKey: ['getSingleNoteRecord'],
    queryFn: () => getSingleNote(token, note_id),
    enabled: false,
  })
}

export const getSingleNote = async (
  token: string,
  note_id: string,
): Promise<{
  id: number
  title: string
  note: string
  created_at: string
}> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/diary/notes/${note_id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateNoteRecord = (form: ISignIn, token: string, note_id: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/diary/notes/${note_id}/`, {
    method: 'PUT',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
