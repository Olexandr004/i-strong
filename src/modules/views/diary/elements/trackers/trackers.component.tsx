import { FC, useState, useEffect } from 'react'

import { DiaryNoteCardComponent } from '@/modules/views/diary/elements'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconUpArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import styles from './trackers.module.scss'

// Интерфейс данных трекера
interface TrackerNote {
  id: number
  note: string
  emotions: string[]
  created_at: string
  is_favorite: boolean
}

interface TrackerMonth {
  month: number
  notes: TrackerNote[]
}

interface TrackerYear {
  year: number
  months: TrackerMonth[]
}

const monthNames = [
  'січень',
  'лютий',
  'березень',
  'квітень',
  'травень',
  'червень',
  'липень',
  'серпень',
  'вересень',
  'жовтень',
  'листопад',
  'грудень',
]

export const TrackerComponent: FC = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const [trackerData, setTrackerData] = useState<TrackerYear[]>([])
  const [expandedMonth, setExpandedMonth] = useState<null | string>(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchTrackerData = async () => {
    try {
      setIsFetching(true)
      const response = await fetch('https://istrongapp.com/api/users/diary/tracker/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('Fetched tracker data:', data) // Логируем полученные данные
      setTrackerData(data.notes || [])
    } catch (error) {
      console.error('Error fetching tracker data:', error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchTrackerData()
    }
  }, [token])

  useEffect(() => {
    console.log('Tracker data in state:', trackerData) // Логируем данные после установки в state
  }, [trackerData])

  const handleExpandMonth = (year: number, month: number) => {
    const monthKey = `${year}-${month}`
    if (expandedMonth === monthKey) {
      setExpandedMonth(null)
    } else {
      setExpandedMonth(monthKey)
    }
  }

  return (
    <div className={styles.notes}>
      {trackerData.map((yearData) => (
        <div key={yearData.year} className={styles.notes__record_block}>
          {yearData.months.map((monthData) => (
            <div key={monthData.month} className={styles.notes__record_block}>
              <h3>
                {monthNames[monthData.month - 1]} {yearData.year}
              </h3>
              <div className={styles.notes__cards}>
                <div className={styles.diary__visible_cards}>
                  {expandedMonth === `${yearData.year}-${monthData.month}`
                    ? monthData.notes
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                        )
                        .map((note) => (
                          <DiaryNoteCardComponent
                            key={note.id}
                            item={{ ...note, title: '' }}
                            type={'tracker'}
                          />
                        ))
                    : monthData.notes
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                        )
                        .slice(0, 2)
                        .map((note) => (
                          <DiaryNoteCardComponent
                            key={note.id}
                            item={{ ...note, title: '' }}
                            type={'tracker'}
                          />
                        ))}
                </div>

                {expandedMonth === `${yearData.year}-${monthData.month}` && (
                  <div
                    className={`${styles.notes__hidden_cards} ${expandedMonth === `${yearData.year}-${monthData.month}` && styles.extended}`}
                  >
                    <div className={styles.notes__hidden_wrapper}></div>
                  </div>
                )}

                {monthData.notes.length > 2 && (
                  <div
                    className={`${styles.notes__arrow_btn} ${expandedMonth === `${yearData.year}-${monthData.month}` && styles.extended}`}
                  >
                    <IconButtonComponent
                      onClick={() => handleExpandMonth(yearData.year, monthData.month)}
                      name={'expand month'}
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
      {isFetching && <p>Loading...</p>}
    </div>
  )
}

export default TrackerComponent
