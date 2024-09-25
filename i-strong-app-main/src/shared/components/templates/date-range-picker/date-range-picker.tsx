'use client'

import moment from 'moment/moment'

import { FC, useState } from 'react'

import { ButtonComponent } from '@/shared/components'
import { useQuerySearchParams } from '@/shared/hooks/useQuerySearchParams'
import { IconUpArrow } from '@/shared/icons'
import { useCommonStore } from '@/shared/stores'

import styles from './date-range-picker.module.scss'

interface IDatePicker {
  value: { first?: string; second?: string }
  onChange: (value: any) => void
}

// component
const DateRangePicker: FC<IDatePicker> = ({ onChange, value }) => {
  const { setQuery } = useQuerySearchParams()
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  const [currentDate, setCurrentDate] = useState(moment())

  const firstDayOfMonth = currentDate.clone().startOf('month')

  const daysOfMonth = Array.from({ length: firstDayOfMonth.daysInMonth() }, (_, i) => {
    const day = firstDayOfMonth.clone().add(i, 'days')
    const weekNumber = day.weekday()
    return { day, weekNumber }
  })

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

  // return
  return (
    <div className={styles.date_picker}>
      <div className={styles.date_picker__top}>
        <button className={styles.date_picker__nav_btn} onClick={() => changePeriod(-1, 'month')}>
          <IconUpArrow />
        </button>

        {currentDate.format('MMMM')}

        <button
          className={`${styles.date_picker__nav_btn} ${styles.next}`}
          onClick={() => changePeriod(1, 'month')}
        >
          <IconUpArrow />
        </button>
      </div>

      {value.first && (
        <div className={styles.date_picker__selected_dates}>
          {value.second && <span>від</span>}

          <div className={styles.date_picker__selected_date}>
            {moment(value.first).format('DD.MM')}
          </div>

          {value.second && (
            <>
              <span>до</span>

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
          Зберегти
        </ButtonComponent>
      </div>
    </div>
  )
}

export default DateRangePicker
