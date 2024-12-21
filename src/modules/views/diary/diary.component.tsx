'use client'
import { useRouter } from 'next/navigation'
import { DiaryNoteCardComponent } from './elements'
import moment from 'moment/moment'
import { FC, useEffect, useState, useRef } from 'react'
import { useGetDiaryRecords, useGetRecordsByDate, useGetTrackerRecords } from '@/api/diary.api'
import { NotesComponent } from '@/modules/views/diary/elements/notes'
import { TrackerComponent } from '@/modules/views/diary/elements/trackers'
import {
  ButtonBarComponent,
  ButtonComponent,
  ModalGettingToInstructionsComponent,
  ScrollToTopButtonComponent,
  PageHeaderComponent,
} from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconUpArrow, IconGuides } from '@/shared/icons'
import { useUserStore, useTabStore, useCommonStore } from '@/shared/stores'
import styles from './diary.module.scss'

//interface
interface IDiary {}

export const DiaryComponent: FC<Readonly<IDiary>> = () => {
  const router = useRouter()
  const token = useUserStore((state) => state.user?.access_token)

  const { activeTab, setActiveTab } = useTabStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  const [extendedBlock, setExtendedBlock] = useState<{ year: null | number; month: null | number }>(
    {
      year: null,
      month: null,
    },
  )

  const tabs = [
    { id: 'main', text: 'Нотатки', isActive: activeTab === 'main' },
    { id: 'tracker', text: 'Трекер', isActive: activeTab === 'tracker' },
    { id: 'challenges', text: 'Челенджі', isActive: activeTab === 'challenges' },
  ]

  const handleCreateNewRecord = () => {
    router.push('/diary/record')
  }

  const { data: diaryRecords, refetch: diaryRecordsRefetch } = useGetDiaryRecords(token ?? '')
  const {
    data: diaryRecordsByDate,
    refetch: diaryRecordsByDateRefetch,
    isFetching,
  } = useGetRecordsByDate(
    token ?? '',
    extendedBlock.year?.toString() ?? '',
    extendedBlock.month?.toString() ?? '',
  )

  const { data: trackerRecords } = useGetTrackerRecords()

  const handleRequestRecordsByDate = (year: number, month: number) => {
    if (extendedBlock.year === year && extendedBlock.month === month) {
      setExtendedBlock({ year: null, month: null }) // Скрыть записи при повторном клике
    } else {
      setExtendedBlock({ year, month }) // Раскрыть записи для выбранного месяца
      setTimeout(() => diaryRecordsByDateRefetch(), 0) // Перезапросить записи
    }
  }

  const handleRefetch = () => {
    diaryRecordsRefetch()
  }

  useEffect(() => {
    if (diaryRecords) {
      const currentMonth = moment().month() + 1
      const currentYear = moment().year()

      // Обновляем extendedBlock только если текущий месяц не раскрыт
      if (extendedBlock.year !== currentYear || extendedBlock.month !== currentMonth) {
        setExtendedBlock({ year: null, month: null }) // Сбрасываем расширенный месяц
      }
    }
  }, [diaryRecords])

  useEffect(() => {
    setActiveTab(activeTab)
  }, [setActiveTab, activeTab])

  // Добавляем состояние и функции для модального окна
  const { isModalActive, modalContent, handleChangeCommonStore } = useCommonStore((state) => ({
    isModalActive: state.isModalActive,
    modalContent: state.modalContent,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))
  const [guideImages, setGuideImages] = useState<string[]>([])

  const fetchGuideImages = async () => {
    try {
      const response = await fetch('https://istrongapp.com/api/guides/diary', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setGuideImages(images)
      } else {
        console.error('Images are not an array or not found:', data.guide?.images)
      }
    } catch (error) {
      console.error('Error fetching guide images:', error)
    }
  }

  const handleIconGuidesClick = () => {
    handleChangeCommonStore({ isModalActive: true, modalContent: 'diary' })
    fetchGuideImages()
  }

  return (
    <section ref={scrollContainerRef} className={`${styles.diary} container`}>
      <div className={styles.titleAndGuide}>
        <h1 className={styles.title}>Щоденник</h1>
        <div className={styles.iconGuides} onClick={handleIconGuidesClick}>
          <IconGuides />
        </div>
      </div>

      <div className={styles.margin_top}>
        <ButtonBarComponent buttons={tabs} onButtonClick={setActiveTab} />
      </div>

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
                        className={`${styles.diary__hidden_cards} ${
                          extendedBlock.month === month.month &&
                          extendedBlock.year === year.year &&
                          styles.extended
                        }`}
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
                        className={`${styles.diary__arrow_btn} ${
                          extendedBlock.month === month.month &&
                          extendedBlock.year === year.year &&
                          styles.extended
                        }`}
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

      {activeTab === 'challenges' && <NotesComponent />}
      {activeTab === 'tracker' && <TrackerComponent />}

      <ModalGettingToInstructionsComponent
        title='Щоденник - фіксуй свої думки і почуття кожного дня, це допоможе тобі слідкувати за своїм прогресом'
        images={guideImages}
        check='diary'
        isModalActive={isModalActive}
        closeModal={() => handleChangeCommonStore({ isModalActive: false })}
      />

      <ScrollToTopButtonComponent scrollContainerRef={scrollContainerRef} />
    </section>
  )
}

export default DiaryComponent
