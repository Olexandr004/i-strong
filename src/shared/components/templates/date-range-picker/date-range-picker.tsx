'use client'

import moment from 'moment'
import 'moment/locale/uk' // подключаем украинскую локаль
import { FC, useState, useEffect } from 'react'

import { ButtonComponent } from '@/shared/components'
import { useQuerySearchParams } from '@/shared/hooks/useQuerySearchParams'
import { IconUpArrow } from '@/shared/icons'
import { useCommonStore } from '@/shared/stores'

import styles from './date-range-picker.module.scss'
import { useTranslation } from 'react-i18next'

interface IDatePicker {
  value: { first?: string; second?: string }
  onChange: (value: any) => void
}

const DateRangePicker: FC<IDatePicker> = ({ onChange, value }) => {
  const { t, i18n } = useTranslation()
  const { setQuery } = useQuerySearchParams()
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  // 👇 синхронизация moment локали с i18n
  useEffect(() => {
    if (i18n.language === 'uk') {
      moment.locale('uk')
    } else {
      moment.locale('en')
    }
  }, [i18n.language])

  const [currentDate, setCurrentDate] = useState(moment())

  const firstDayOfMonth = currentDate.clone().startOf('month')

  const daysOfMonth = Array.from({ length: firstDayOfMonth.daysInMonth() }, (_, i) => {
    const day = firstDayOfMonth.clone().add(i, 'days')
    const weekNumber = day.weekday()
    return { day, weekNumber }
  })

  // 👇 теперь moment.weekdaysShort() будет на нужной локали
  const daysOfWeek = moment.weekdaysShort().slice(1).concat(moment.weekdaysShort().slice(0, 1))

  const changePeriod = (amount: number, period: 'month' | 'year') => {
    setCurrentDate(currentDate.clone().add(amount, period))
  }

  const saveDatePeriod = () => {
    setQuery({
      start_date: value?.first,
      end_date: value?.second ?? value?.first,
    })

    handleChangeCommonStore({ isModalActive: false })
  }

  const handlePickDate = (e: any) => {
    const selectedDay = moment(e.target.value)
    if (value?.second) {
      onChange({ first: selectedDay?.toISOString(), second: undefined })
    } else if (value?.first) {
      if (moment(selectedDay).isBefore(moment(value?.first))) {
        onChange({ first: selectedDay?.toISOString(), second: value?.first })
      } else {
        onChange({ first: value?.first, second: selectedDay?.toISOString() })
      }
    } else {
      onChange({ first: selectedDay?.toISOString(), second: value?.second })
    }
  }

  return (
    <div className={styles.date_picker}>
      <div className={styles.date_picker__top}>
        <button className={styles.date_picker__nav_btn} onClick={() => changePeriod(-1, 'month')}>
          <IconUpArrow />
        </button>

        {/* 👇 месяц теперь будет переводиться */}
        {currentDate.format('MMMM YYYY')}

        <button
          className={`${styles.date_picker__nav_btn} ${styles.next}`}
          onClick={() => changePeriod(1, 'month')}
        >
          <IconUpArrow />
        </button>
      </div>

      {value.first && (
        <div className={styles.date_picker__selected_dates}>
          {value.second && <span>{t('date.from')}</span>}

          <div className={styles.date_picker__selected_date}>
            {moment(value.first).format('DD.MM')}
          </div>

          {value.second && (
            <>
              <span>{t('date.to')}</span>

              <div className={styles.date_picker__selected_date}>
                {moment(value.second).format('DD.MM')}
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.date_picker__calendar}>
        {daysOfWeek.map((dayOfWeek) => (
          <div key={dayOfWeek} className={styles.date_picker__day_of_week}>
            {dayOfWeek.slice(0, 1)}
          </div>
        ))}

        {daysOfMonth?.map(({ day, weekNumber }) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handlePickDate({ target: { value: day.toISOString() } })
            }}
            key={day.format('YYYY-MM-DD')}
            className={`${styles.date_picker__day}
                   ${value?.first && moment(value?.first)?.isSame(day, 'day') && styles.active}
                   ${moment().isSame(day, 'day') && styles.today}
                   ${value?.second && moment(value?.second)?.isSame(day, 'day') && styles.active}
                   ${value?.first && value?.second && day?.isBetween(moment(value?.first), moment(value?.second)) && styles.active}
                   ${value?.second && value?.first && day?.isBetween(moment(value?.second), moment(value?.first)) && styles.active}
                   `}
            style={{ gridColumn: `${weekNumber + 1}/${weekNumber + 2}` }}
          >
            {day.format('DD')}
          </button>
        ))}
      </div>

      <div className={styles.date_picker__bottom}>
        <ButtonComponent size={'small'} onClick={saveDatePeriod} variant={'outlined'}>
          {t('reset_password.save')}
        </ButtonComponent>
      </div>
    </div>
  )
}

export default DateRangePicker
