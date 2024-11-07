// hooks/useTracker.ts

import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query'

interface Note {
  id: number // ID заметки
  emotions: string[] // Массив эмоций
  note: string // Содержимое заметки
  created_at: string // Дата создания (можно использовать Date, если предпочитаете)
  is_favorite: boolean // Статус избранного
}

interface TrackerRecord {
  note: Note // Вложенный объект note
}

// API call to fetch a single tracker record
const getSingleTracker = async (token: string, noteId: string): Promise<TrackerRecord> => {
  const response = await fetch(`https://istrongapp.com/api/users/diary/tracker/${noteId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return await response.json()
}

// Hook to get a single tracker record
export const useGetSingleTracker = (token: string, noteId: string) => {
  const queryOptions: UseQueryOptions<TrackerRecord, Error> = {
    queryKey: ['singleTracker', noteId], // Ключ запроса
    queryFn: () => getSingleTracker(token, noteId), // Функция для получения данных
    enabled: !!token && !!noteId, // Запрос активен, если есть token и noteId
  }

  const query = useQuery(queryOptions)

  // Отдельная обработка ошибок и успешного получения данных
  if (query.isError) {
    console.error('Error fetching tracker record:', query.error)
  }
  if (query.isSuccess) {
    console.log('Tracker record fetched successfully:', query.data)
  }

  return query
}

// API call to update a tracker record
const updateTrackerRecord = async (
  form: any,
  token: string,
  noteId: string,
): Promise<TrackerRecord> => {
  const response = await fetch(`https://istrongapp.com/api/users/diary/tracker/${noteId}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      note: form.note,
    }),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return await response.json()
}

// Hook to update a tracker record
export const useUpdateTrackerRecord = (token: string, noteId: string) => {
  return useMutation<TrackerRecord, Error, any>({
    mutationFn: (form: any) => updateTrackerRecord(form, token, noteId),
    onError: (error) => {
      console.error('Error updating tracker record:', error)
    },
    onSuccess: (data) => {
      console.log('Tracker record updated successfully:', data)
    },
  })
}
