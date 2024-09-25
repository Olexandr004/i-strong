import { useMutation } from '@tanstack/react-query'

import { useRequest } from '@/api/useRequest'
import { useUserStore } from '@/shared/stores'

export const patchUserActivities = async (token: string, activity_type: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/activities/${activity_type}/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

const handleError = (error: Error) => {
  console.log(`Error: ${error.message}`)
}

export const useUserActivities = () => {
  const { user, handleChangeUserStore } = useUserStore()

  const token = user?.access_token || ''
  const { mutate: mutateUserActivities, status } = useMutation({
    mutationFn: (activity_type: string) => {
      return patchUserActivities(token, activity_type)
    },
    onSuccess: (data: any) => {
      handleChangeUserStore({ user: data?.user })
    },
    onError: handleError,
  })
  return { mutateUserActivities, status }
}
