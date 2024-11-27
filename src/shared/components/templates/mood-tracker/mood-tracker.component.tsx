import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import 'moment/locale/uk'
import { FC } from 'react'
import { ButtonComponent } from '@/shared/components'
import { useUserStore } from '@/shared/stores'
import styles from './mood-tracker.module.scss'
import { MOODS } from '@/shared/constants/moods'

// Маппинг месяцев
const monthNamesGenitive: { [key: string]: string } = {
  січень: 'січня',
  лютий: 'лютого',
  березень: 'березня',
  квітень: 'квітня',
  травень: 'травня',
  червень: 'червня',
  липень: 'липня',
  серпень: 'серпня',
  вересень: 'вересня',
  жовтень: 'жовтня',
  листопад: 'листопада',
  грудень: 'грудня',
}

// API-запрос
const fetchUserProfile = async (token: string) => {
  const response = await fetch('https://istrongapp.com/api/users/profile/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  return response.json()
}

const MoodTrackerComponent: FC = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const router = useRouter()

  const { data, isError, isLoading } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      const data = await fetchUserProfile(token ?? '')
      handleChangeUserStore({ user: data })
      return data
    },
    enabled: !!token,
  })

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  if (isError) {
    return <div>Помилка завантаження даних.</div>
  }

  const user = data
  const currentMonth = moment().format('MMMM')
  const currentMonthGenitive =
    monthNamesGenitive[currentMonth as keyof typeof monthNamesGenitive] ?? ''
  const selectedMoodSlug = user?.mood?.mood ?? null
  const moodCreatedAt = user?.mood?.created_at

  const selectedMood = MOODS.find((mood) => mood.slug === selectedMoodSlug)

  if (!selectedMood) {
    return (
      <section className={styles.mood_tracker_passive}>
        <h2 className={styles.mood_tracker__title}>Трекер настрою</h2>
        <div>
          <img
            src='/image/capibara_mood_tracker.png'
            alt='capibara_mood_tracker'
            className={styles.mood_tracker_passive__image}
          />
          <div className={styles.mood_tracker__box}>
            <div className={styles.mood_tracker__box2}>
              <div className={styles.mood_tracker__bottom}>
                <div className={styles.mood_tracker__selected_emotion_passive}>
                  <span className={styles.mood_tracker_passive__time_passive}>
                    <span className={styles.mood_tracker__day}>{moment().format('DD')}</span>
                    <span className={styles.mood_tracker__month}>{currentMonthGenitive}</span>
                  </span>
                </div>
              </div>
              <div className={styles.mood_tracker__top_passive}>
                <span>Як твій настрій сьогодні?</span>
                <span>Поділись зі мною</span>
              </div>
              <button
                className={styles.mood_tracker__btn}
                onClick={() => router.push('/select-mood')}
              >
                +
              </button>
            </div>
            <div className={styles.mood_tracker__statistics}>
              <ButtonComponent
                onClick={() => router.push('/statistic')}
                size='small'
                variant='filled'
              >
                Статистика
              </ButtonComponent>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.mood_tracker}>
      <h2 className={styles.mood_tracker__title}>Трекер настрою</h2>
      <div className={styles.mood_tracker__box}>
        <div className={styles.mood_tracker__box2}>
          <div className={styles.mood_tracker__bottom}>
            <div
              className={styles.mood_tracker__selected_emotion}
              style={{ backgroundColor: selectedMood.color }}
            >
              {selectedMood.icon}
            </div>
          </div>
          <div className={styles.mood_tracker__top}>
            <span>Останнє оновлення:</span>
            <span className={styles.mood_tracker__time}>
              {moment(moodCreatedAt).isSame(new Date(), 'day')
                ? `Сьогодні ${moment.utc(moodCreatedAt).local().format('HH:mm')}`
                : moment.utc(moodCreatedAt).local().format('dddd HH:mm')}
            </span>
          </div>
          <button className={styles.mood_tracker__btn} onClick={() => router.push('/select-mood')}>
            +
          </button>
        </div>
        <div className={styles.mood_tracker__statistics}>
          <ButtonComponent onClick={() => router.push('/statistic')} size='small' variant='filled'>
            Статистика
          </ButtonComponent>
        </div>
      </div>
    </section>
  )
}

export default MoodTrackerComponent
