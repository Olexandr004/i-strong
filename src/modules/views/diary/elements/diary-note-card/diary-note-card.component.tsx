import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import moment from 'moment'
import { FC } from 'react'
import { postDeleteRecord } from '@/api/diary.api'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconTrashBin } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import styles from './diary-note-card.module.scss'

// interface
interface IDiaryNoteCard {
  item: {
    created_at: string
    id: number
    note: string
    title: string
    emotions?: string[] // предполагается, что эмоции передаются в виде массива строк
  }
  diaryRecordsRefetch?: () => void
  type?: 'diary' | 'note' | 'tracker' // добавлен новый тип 'tracker'
}

// component
export const DiaryNoteCardComponent: FC<Readonly<IDiaryNoteCard>> = ({
  item,
  diaryRecordsRefetch,
  type,
}) => {
  const router = useRouter()
  const token = useUserStore((state) => state.user?.access_token)

  const { mutate: postDeleteNote } = useMutation({
    mutationFn: (note_id: string) => postDeleteRecord(note_id, token ?? ''),
    onSuccess: (data: any) => {
      diaryRecordsRefetch ? diaryRecordsRefetch() : null
    },
  })

  const handleOpenExistingRecord = () => {
    console.log('Opening record for type:', type) // добавлено логирование
    switch (type) {
      case 'note':
        router.push(`/diary/note-record?record_id=${item.id.toString()}`)
        break
      case 'tracker':
        console.log('Navigating to tracker record with ID:', item.id) // добавлено логирование
        router.push(`/diary/tracker-record?record_id=${item.id.toString()}`) // ссылка для tracker
        break
      default: // 'diary'
        router.push(`/diary/record?record_id=${item.id.toString()}`)
    }
  }

  const handleDeleteRecord = () => {
    postDeleteNote(item.id.toString())
  }

  const modifiedNote = item.note.slice(1, -1)
  const createdAt = moment(item.created_at) // используем moment для работы с датой и временем
  const formattedDate = createdAt.format('DD.MM.YYYY')
  const formattedTime = createdAt.format('HH:mm') // форматируем время

  //return
  return (
    <article className={styles.diary_card} onClick={handleOpenExistingRecord}>
      <div className={styles.diary_card__header}>
        <span>
          {formattedDate} {type === 'tracker' && `- ${formattedTime}`}
        </span>

        {type !== 'note' && type !== 'tracker' && (
          <IconButtonComponent onClick={handleDeleteRecord} name={'delete record'}>
            <IconTrashBin />
          </IconButtonComponent>
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
            <p className={styles.diary_card__text}>{modifiedNote}</p>
          </>
        )}
      </div>
    </article>
  )
}

export default DiaryNoteCardComponent
