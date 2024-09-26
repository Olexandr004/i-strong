import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import moment from 'moment'

import { FC } from 'react'

import { postDeleteRecord } from '@/api/diary.api'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconTrashBin } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import styles from './diary-note-card.module.scss'

//interface
interface IDiaryNoteCard {
  item: {
    created_at: string
    id: number
    note: string
    title: string
  }
  diaryRecordsRefetch?: () => void
  type?: 'diary' | 'note'
}

//component
export const DiaryNoteCardComponent: FC<Readonly<IDiaryNoteCard>> = ({
  item,
  diaryRecordsRefetch,
  type,
}) => {
  const router = useRouter()
  const token = useUserStore((state) => state.user?.access_token)

  // const queryClient = useQueryClient()

  const { mutate: postDeleteNote } = useMutation({
    mutationFn: (note_id: string) => postDeleteRecord(note_id, token ?? ''),
    onSuccess: (data: any) => {
      diaryRecordsRefetch ? diaryRecordsRefetch() : null
    },
  })

  const handleOpenExistingRecord = () => {
    type === 'note'
      ? router.push(`/diary/note-record?record_id=${item.id.toString()}`)
      : router.push(`/diary/record?record_id=${item.id.toString()}`)
  }

  const handleDeleteRecord = () => {
    postDeleteNote(item.id.toString())
  }
  const modifiedNote = item.note.slice(1, -1)
  //return
  return (
    <article className={styles.diary_card} onClick={handleOpenExistingRecord}>
      <div className={styles.diary_card__header}>
        <span>{moment(item?.created_at).format('DD.MM.YYYY')}</span>

        {type !== 'note' && (
          <IconButtonComponent onClick={handleDeleteRecord} name={'delete record'}>
            <IconTrashBin />
          </IconButtonComponent>
        )}
      </div>

      <div className={styles.diary_card__main}>
        <p className={styles.diary_card__title}>{item?.title}</p>

        <p className={styles.diary_card__text}>{modifiedNote}</p>
      </div>
    </article>
  )
}
export default DiaryNoteCardComponent
