import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { FC, useState, useEffect } from 'react'
import { postDeleteRecord, postAddToFavorites, deleteFromFavorites } from '@/api/diary.api'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconTrashBin, IconFavorite } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import styles from './diary-note-card.module.scss'

interface IDiaryNoteCard {
  item: {
    created_at: string
    id: number
    note: string
    title: string
    emotions?: string[]
    is_favorite?: boolean // добавлен новый флаг
  }
  diaryRecordsRefetch?: () => void
  type?: 'main' | 'challenges' | 'tracker'
  showActions?: boolean
}

export const DiaryNoteCardComponent: FC<Readonly<IDiaryNoteCard>> = ({
  item,
  diaryRecordsRefetch,
  type,
  showActions = true,
}) => {
  const router = useRouter()
  const token = useUserStore((state) => state.user?.access_token)
  const queryClient = useQueryClient()

  // Локальное состояние для отслеживания избранности
  const [is_favorite, setIsFavorite] = useState<boolean>(item.is_favorite ?? false)

  // Мутация для удаления записи
  const { mutate: postDeleteNote } = useMutation({
    mutationFn: (note_id: string) => postDeleteRecord(note_id, token ?? ''),
    onSuccess: () => {
      diaryRecordsRefetch ? diaryRecordsRefetch() : null
    },
  })

  // Мутация для добавления в избранное

  const { mutate: addToFavorites } = useMutation({
    mutationFn: () => postAddToFavorites(item.id, type ?? 'main', token ?? ''),
    onSuccess: () => {
      // Типизируем корректно, чтобы избежать ошибок с фильтрами
      queryClient.invalidateQueries({
        queryKey: ['favorites'], // Используем объект с queryKey
      })
      setIsFavorite(true) // Обновляем локальное состояние после успешной операции
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error)
      setIsFavorite(item.is_favorite ?? false) // В случае ошибки, восстанавливаем исходное состояние
    },
  })

  // Мутация для удаления из избранного
  const { mutateAsync: removeFromFavorites, status } = useMutation({
    mutationFn: () => deleteFromFavorites(item.id, type ?? 'main', token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorites'], // Используем объект с queryKey
      })
      setIsFavorite(false) // Обновляем локальное состояние после успешной операции
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error)
      setIsFavorite(item.is_favorite ?? false) // В случае ошибки, восстанавливаем исходное состояние
    },
  })

  // Используйте статус мутации для проверки загрузки:
  const isRemovingFavorite = status === 'pending'

  // Синхронизация состояния избранности с сервером
  useEffect(() => {
    setIsFavorite(item.is_favorite ?? false)
  }, [item.is_favorite])

  const handleOpenExistingRecord = () => {
    switch (type) {
      case 'challenges':
        router.push(`/diary/note-record?record_id=${item.id.toString()}`)
        break
      case 'tracker':
        router.push(`/diary/tracker-record?record_id=${item.id.toString()}`)
        break
      default:
        router.push(`/diary/record?record_id=${item.id.toString()}`)
    }
  }

  const handleDeleteRecord = () => {
    postDeleteNote(item.id.toString())
  }

  const toggleFavorite = () => {
    if (is_favorite) {
      removeFromFavorites()
    } else {
      addToFavorites()
    }
  }

  const modifiedNote = item.note.slice(1, -1) || 'Тут ще немає тексту'
  const createdAt = moment(item.created_at)
  const formattedDate = createdAt.format('DD.MM.YYYY')
  const formattedTime = createdAt.format('HH:mm')

  return (
    <article className={styles.diary_card} onClick={handleOpenExistingRecord}>
      <div className={styles.diary_card__header}>
        <span>
          {formattedDate} {type === 'tracker' && `- ${formattedTime}`}
        </span>

        {showActions && (
          <div>
            <IconButtonComponent
              onClick={toggleFavorite}
              name={is_favorite ? 'remove favorite' : 'add favorite'}
            >
              <IconFavorite className={is_favorite ? styles.filled : styles.outline} />
            </IconButtonComponent>

            {type !== 'challenges' && type !== 'tracker' && (
              <IconButtonComponent onClick={handleDeleteRecord} name={'delete record'}>
                <IconTrashBin />
              </IconButtonComponent>
            )}
          </div>
        )}
      </div>

      <div className={styles.diary_card__main}>
        {type === 'tracker' && item.emotions ? (
          item.emotions.length > 0 ? (
            <>
              <p className={styles.diary_card__title}>
                {item.emotions[0]}{' '}
                {item.emotions.length > 1 ? (
                  <span className={styles.gray_text}>ще +{item.emotions.length - 1}</span>
                ) : (
                  ''
                )}
              </p>
              <p className={styles.diary_card__text}>{modifiedNote}</p>
            </>
          ) : (
            <p className={styles.diary_card__title}>Мій стан</p>
          )
        ) : (
          <>
            <p className={styles.diary_card__title}>{item?.title}</p>
            <p className={styles.diary_card__text}>{modifiedNote || 'Тут ще немає тексту'}</p>
          </>
        )}
      </div>
    </article>
  )
}

export default DiaryNoteCardComponent
