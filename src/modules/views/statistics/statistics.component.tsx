'use client'

import { useSearchParams } from 'next/navigation'
import 'moment/locale/uk'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import { useGetStatistics } from '@/api/mood-tracker'
import { EmotionsChartComponent } from '@/modules/views/statistics/elements'
import { ModalGettingToInstructionsComponent, PageHeaderComponent } from '@/shared/components'
import { CalendarModalComponent } from '@/shared/components/templates/calendar-modal'
import { SelectComponent } from '@/shared/components/ui/select'
import { useQuerySearchParams } from '@/shared/hooks/useQuerySearchParams'
import { IconCalendar, IconGuides } from '@/shared/icons'
import { useCommonStore, useUserStore } from '@/shared/stores'
import styles from './statistics.module.scss'

// interface
interface IStatistics {}

interface IEmotions {
  'Не дуже': number
  Чудово: number
  Нормально: number
  Зле: number
}

// component
export const StatisticsComponent: FC<Readonly<IStatistics>> = () => {
  const searchParams = useSearchParams()
  const { setQuery } = useQuerySearchParams()

  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const isModalActive = useCommonStore((state) => state.isModalActive)
  const activeModal = useCommonStore((state) => state.activeModal)
  const token = useUserStore((state) => state.user?.access_token)

  const [dates, setDates] = useState({ first: '', second: '' })
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [customPeriod, setCustomPeriod] = useState<null | number>(null)
  const [modalContent, setModalContent] = useState<string[]>([]) // Состояние для данных модального окна

  const removeMilliseconds = (timeString: string | null | undefined) => {
    return moment(timeString).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  }

  const { data: statInfo, refetch: statisticsRefetch } = useGetStatistics(token ?? '', {
    start_date: searchParams.get('start_date')
      ? removeMilliseconds(searchParams.get('start_date')?.toString())
      : removeMilliseconds(moment().startOf('day').toString()),

    end_date: searchParams.get('end_date')
      ? removeMilliseconds(searchParams.get('end_date')?.toString())
      : removeMilliseconds(moment().endOf('day').toString()),
  })

  // Fetch для получения контента модального окна
  const fetchGuideImages = async () => {
    try {
      const response = await fetch(`https://istrongapp.com/api/guides/mood-stats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      console.log('Fetched guide data for statistics:', data)

      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setModalContent(images)
      } else {
        console.error('Images are not an array or not found:', data.guide?.images)
      }
    } catch (error) {
      console.error('Error fetching guide images for statistics:', error)
    }
  }

  const handleIconGuidesClick = () => {
    console.log('IconGuides clicked in StatisticsComponent!')
    handleChangeCommonStore({ isModalActive: true, activeModal: 'mood-stats' })
    fetchGuideImages() // Загружаем данные для модального окна
  }

  const getDateRange = () => {
    if (searchParams.get('start_date') && searchParams.get('end_date')) {
      if (
        moment(searchParams.get('start_date')).isSame(moment(searchParams.get('end_date')), 'day')
      ) {
        return `${moment(searchParams.get('start_date')).format('DD.MM.YYYY')}`
      } else
        return `${moment(searchParams.get('start_date')).format('DD.MM.YYYY')} - ${moment(
          searchParams.get('end_date'),
        ).format('DD.MM.YYYY')}`
    } else return moment().format('DD.MM.YYYY')
  }

  const handleSetDates = (value: { first: string; second: string }) => {
    setDates(value)
    const duration = moment.duration(moment(value.second).diff(moment(value.first)))

    if (!value.second) {
      setCustomPeriod(1)
    } else {
      setCustomPeriod(duration.asDays())
    }
  }

  const handleChangeSelectedPeriod = (value: string) => {
    const validStartOfValues: Array<
      'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
    > = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']

    if (
      value !== 'custom' &&
      validStartOfValues.includes(
        value as 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second',
      )
    ) {
      setQuery({
        start_date: moment()
          .startOf(value as 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')
          .toISOString(),
        end_date: moment()
          .endOf(value as 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')
          .toISOString(),
      })

      setCustomPeriod(0)
    }

    setSelectedPeriod(value)
  }

  useEffect(() => {
    if (customPeriod) {
      setSelectedPeriod('custom')
    }
  }, [customPeriod])

  useEffect(() => {
    statisticsRefetch()
  }, [searchParams.get('start_date'), searchParams.get('end_date'), selectedPeriod])

  useEffect(() => {
    const visitedKey = `mood-stats_visited`
    if (!localStorage.getItem(visitedKey)) {
      handleChangeCommonStore({ isModalActive: true, activeModal: 'mood-stats' })
    }
  }, [])

  return (
    <section className={`${styles.statistics} container`}>
      <PageHeaderComponent title={'Статистика'} />

      <div className={styles.statistics__settings}>
        <div className={styles.statistics__select_wrapper}>
          <SelectComponent
            selectedValue={selectedPeriod}
            setSelectedValue={handleChangeSelectedPeriod}
            duration={customPeriod}
          />
        </div>

        <button
          className={styles.statistics__calendar_btn}
          onClick={() =>
            handleChangeCommonStore({
              isModalActive: true,
              activeModal: 'calendar',
            })
          }
        >
          <IconCalendar />
        </button>

        <div className={styles.iconGuides} onClick={handleIconGuidesClick}>
          <IconGuides />
        </div>
      </div>

      {Boolean(statInfo) && (
        <div className={styles.statistics__chart}>
          <span>{getDateRange()}</span>

          <EmotionsChartComponent emotions={statInfo as IEmotions} />
        </div>
      )}

      <div className={styles.statistics__advice}>
        <h2 className={styles.statistics__advice_title}>Порада</h2>

        <p>
          Записуй у щоденнику що викликало у тебе ті чи інші почуття, щоб аналізувати причини та
          наслідки і почувати себе краще.
        </p>
      </div>

      {isModalActive && activeModal === 'mood-stats' && (
        <ModalGettingToInstructionsComponent
          title='Статистика - аналізуй свої емоції'
          images={modalContent}
          check='mood-stats'
          isModalActive={isModalActive}
          closeModal={() => handleChangeCommonStore({ isModalActive: false, activeModal: null })}
        />
      )}

      {isModalActive && activeModal === 'calendar' && (
        <CalendarModalComponent value={dates} onChange={handleSetDates} />
      )}
    </section>
  )
}

export default StatisticsComponent
