import { useQuery } from '@tanstack/react-query'

import { request } from '@/api/useRequest'

export const putResetUserPassword = async (token: string, new_password: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/profile/password/  `, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      new_password,
    },
  })
}

export const putResetUserPin = async (token: string, new_password: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/profile/dairy-password/  `, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      new_password,
    },
  })
}

export const putUpdateUserInfo = async (token: string, username: string, phone_number: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request('users/profile/contact-info/', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      username,
      phone_number,
    },
  })
}

export const deleteAccount = async (token: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/profile/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetUserProfile = (token: string) => {
  return useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => getUserProfile(token),
    enabled: false,
  })
}

export const getUserProfile = async (token: string): Promise<any> => {
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`users/profile/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
