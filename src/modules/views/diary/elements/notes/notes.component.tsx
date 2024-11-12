import { FC, useState } from 'react'

import { useGetAllNotesByChallenge, useGetNotes } from '@/api/notes'
import { DiaryNoteCardComponent } from '@/modules/views/diary/elements'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconUpArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import styles from './notes.module.scss'

//interface
interface INotes {}

//component
export const NotesComponent: FC<Readonly<INotes>> = () => {
  const token = useUserStore((state) => state.user?.access_token)

  const [extendedNote, setExtendedNote] = useState<null | string>(null)

  const { data: diaryNotes, refetch: notesRefetch } = useGetNotes(token ?? '')
  const notes = Array.isArray(diaryNotes?.notes) ? diaryNotes.notes : []
  const {
    data: allNotesByChallenge,
    refetch: allNotesByChallengeRefetch,
    isFetching,
  } = useGetAllNotesByChallenge(token ?? '', extendedNote ?? '')

  const handleRequestNotesByChallenge = (id: number) => {
    if (id.toString() === extendedNote) {
      setExtendedNote(null)
    } else {
      setExtendedNote(id.toString())
      setTimeout(() => allNotesByChallengeRefetch(), 0)
    }
  }

  //return
  return (
    <div className={styles.notes}>
      {notes?.map((challenge, index) => (
        <div className={styles.notes__record_block} key={`${challenge.challenge.id}-${index}`}>
          <p>{challenge.challenge.title}</p>

          <div className={styles.notes__cards}>
            <div className={styles.diary__visible_cards}>
              {challenge.notes.map(
                (
                  item: any, // Убираем slice, чтобы показывать все записи
                ) => (
                  <DiaryNoteCardComponent
                    key={`${item.id}-${index}`}
                    item={item}
                    type={'challenges'}
                  />
                ),
              )}
            </div>

            {!isFetching && allNotesByChallenge && (
              <div
                className={`${styles.notes__hidden_cards} ${extendedNote === challenge.challenge.id.toString() && styles.extended}`}
              >
                <div className={styles.notes__hidden_wrapper}>
                  {allNotesByChallenge?.notes.map((item: any, index) => (
                    <DiaryNoteCardComponent
                      key={`${index}--${item.id}`}
                      item={item}
                      type={'challenges'}
                    />
                  ))}
                </div>
              </div>
            )}

            {challenge.notes.length > 2 && (
              <div
                className={`${styles.notes__arrow_btn} ${extendedNote === challenge.challenge.id.toString() && styles.extended}`}
              >
                <IconButtonComponent
                  onClick={() => handleRequestNotesByChallenge(challenge.challenge.id)}
                  name={'open all'}
                >
                  <IconUpArrow />
                </IconButtonComponent>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesComponent
