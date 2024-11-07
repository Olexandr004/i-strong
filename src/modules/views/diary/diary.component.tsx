'use client'
import { useRouter } from 'next/navigation'
import { DiaryNoteCardComponent } from './elements'
import moment from 'moment/moment'
import { FC, useEffect, useState } from 'react'
import { useGetDiaryRecords, useGetRecordsByDate, useGetTrackerRecords } from '@/api/diary.api'
import { NotesComponent } from '@/modules/views/diary/elements/notes'
import { TrackerComponent } from '@/modules/views/diary/elements/trackers'
import {
  ButtonBarComponent,
  ButtonComponent,
  ModalGettingToInstructionsComponent,
} from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconUpArrow } from '@/shared/icons'
import { ImageCapybaraBook } from '@/shared/images'
import { useUserStore } from '@/shared/stores'
import styles from './diary.module.scss'

//interface
interface IDiary {}

//component
export const DiaryComponent: FC<Readonly<IDiary>> = () => {
  const router = useRouter()
  const token = useUserStore((state) => state.user?.access_token)

  const [activeTab, setActiveTab] = useState('main')
  const [extendedBlock, setExtendedBlock] = useState<{ year: null | number; month: null | number }>(
    {
      year: null,
      month: null,
    },
  )

  const tabs = [
    { id: 'main', text: 'Нотатки', isActive: activeTab === 'main' },
    { id: 'tracker', text: 'Трекер', isActive: activeTab === 'tracker' },
    { id: 'notes', text: 'Челенджі', isActive: activeTab === 'notes' },
  ]

  const handleCreateNewRecord = () => {
    router.push('/diary/record')
  }

  const { data: diaryRecords, refetch: diaryRecordsRefetch } = useGetDiaryRecords(token ?? '')
  console.log('🚀 ~ diaryRecords:', diaryRecords)

  const {
    data: diaryRecordsByDate,
    refetch: diaryRecordsByDateRefetch,
    isFetching,
  } = useGetRecordsByDate(
    token ?? '',
    extendedBlock.year?.toString() ?? '',
    extendedBlock.month?.toString() ?? '',
  )

  const { data: trackerRecords } = useGetTrackerRecords() // Получаем данные трекера

  const handleRequestRecordsByDate = (year: number, month: number) => {
    if (extendedBlock.year === year && extendedBlock.month === month) {
      setExtendedBlock({ year: null, month: null })
    } else {
      setExtendedBlock({ year, month })
      setTimeout(() => diaryRecordsByDateRefetch(), 0)
    }
  }

  const handleRefetch = () => {
    diaryRecordsRefetch()
  }

  useEffect(() => {
    if (diaryRecords) {
      const currentMonth = moment().month() + 1 // момент возвращает индекс, добавляем 1
      const currentYear = moment().year()

      // Здесь, возможно, необходимо установить `extendedBlock` в значения из `diaryRecords`
      setExtendedBlock({ year: currentYear, month: currentMonth })
    }
  }, [diaryRecords])

  //return
  return (
    <section className={`${styles.diary} container`}>
      <h1 className={`title`}>Щоденник</h1>
      <ButtonBarComponent buttons={tabs} onButtonClick={setActiveTab} />
      {activeTab === 'main' && (
        <>
          {!diaryRecords?.has_note_today ? (
            <ButtonComponent variant={'outlined'} onClick={handleCreateNewRecord}>
              Додати запис
            </ButtonComponent>
          ) : (
            <p className={styles.diary__disable_new_record}>
              Запис про сьогоднішній день вже створено. Так тримати!
            </p>
          )}
        </>
      )}
      {activeTab === 'main' && (
        <div className={styles.diary__records}>
          {diaryRecords?.notes?.map((year, index) => (
            <div className={styles.diary__records} key={`${year.year}-${index}`}>
              {year?.months?.map((month, index) => (
                <div key={`${month.month}-${index}`} className={styles.diary__record_block}>
                  <p>
                    {month.month && (
                      <p>
                        {moment(`${year.year}-${month.month}`, 'YYYY-M').format('MMMM')} {year.year}
                      </p>
                    )}
                  </p>

                  <div className={styles.diary__record_cards}>
                    <div>
                      {month.notes.slice(0, 3).map((item: any) => (
                        <DiaryNoteCardComponent
                          key={`${item.id}-${index}`}
                          item={item}
                          diaryRecordsRefetch={handleRefetch}
                        />
                      ))}
                    </div>

                    {!isFetching && diaryRecordsByDate?.notes && (
                      <div
                        className={`${styles.diary__hidden_cards} ${extendedBlock.month === month.month && extendedBlock.year === year.year && styles.extended}`}
                      >
                        <div className={styles.diary__hidden_wrapper}>
                          {diaryRecordsByDate?.notes
                            .slice(3)
                            .map((item: any, index) => (
                              <DiaryNoteCardComponent
                                key={`${item.id}-${index}`}
                                item={item}
                                diaryRecordsRefetch={handleRefetch}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {month.notes.length > 3 && (
                      <div
                        className={`${styles.diary__arrow_btn} ${extendedBlock.month === month.month && extendedBlock.year === year.year && styles.extended}`}
                      >
                        <IconButtonComponent
                          onClick={() => handleRequestRecordsByDate(year.year, month.month)}
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
          ))}
        </div>
      )}
      {activeTab === 'notes' && <NotesComponent />}
      {activeTab === 'tracker' && <TrackerComponent />}
      {/* Новая вкладка для трекера */}
      <ModalGettingToInstructionsComponent
        title='Щоденник - це надійне місце для усіх твоїх спогадів та емоцій. Роби записи кожного дня щоб отримувати'
        coin={true}
        image={ImageCapybaraBook}
        buttonText='Круто!'
        check='diary'
      />
    </section>
  )
}
export default DiaryComponent
