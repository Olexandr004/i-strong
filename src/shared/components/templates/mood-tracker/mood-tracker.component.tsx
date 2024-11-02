import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import 'moment/locale/uk'
import moment from 'moment'
import { FC } from 'react'
import { postMood } from '@/api/mood-tracker'
import { useGetUserProfile } from '@/api/setting-user.api'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'
import { ButtonComponent } from '@/shared/components'
import styles from './mood-tracker.module.scss'

interface IMoodTrackerComponent {}
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

export const MoodTrackerComponent: FC<Readonly<IMoodTrackerComponent>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const currentMonth = moment().format('MMMM') // "жовтень"
  const currentMonthGenitive =
    monthNamesGenitive[currentMonth as keyof typeof monthNamesGenitive] ?? ''

  const selectedMood = user?.mood?.mood ?? null // Сохраняем null, если настроение не отмечено
  const { data: UserProfile, refetch: userProfileRefetch } = useGetUserProfile(token ?? '')

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),
    onSuccess: (data: any) => {
      console.log(data)
      userProfileRefetch().then((data) => {
        handleChangeUserStore({ user: data.data })
      })
    },
    onError: (error) => {
      console.error('Error posting mood:', error)
      // Здесь можно добавить логику для отображения ошибки
    },
  })

  // Функция для навигации на страницу /statistics
  const goToStatistics = () => {
    router.push('/statistic')
  }

  // Функция для навигации на страницу /select-mood
  const goToSelectMood = () => {
    router.push('/select-mood')
  }

  const selectedMoodData = MOODS.find((item) => item.slug === selectedMood)

  // Проверяем, есть ли у пользователя настроение, если нет — рендерим альтернативный компонент
  if (!selectedMood) {
    return (
      <section className={`${styles.mood_tracker_passive}`}>
        <h2 className={styles.mood_tracker__title}>Трекер настрою</h2>

        {/* Контейнер, внутри которого будет и картинка, и блок */}
        <div>
          {/* Изображение капибары */}
          <img
            src='/image/capibara_mood_tracker.png'
            alt='capibara_mood_tracker'
            className={styles.mood_tracker_passive__image}
          />

          {/* Блок с контентом */}
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
                <span>
                  Як твій настрій <br /> сьогодні?
                </span>
                <span>Поділись зі мною</span>
              </div>
              <button className={styles.mood_tracker__btn} onClick={goToSelectMood}>
                +
              </button>
            </div>
            {/* Кнопка для перехода к статистике */}
            <div className={styles.mood_tracker__statistics}>
              <ButtonComponent onClick={goToStatistics} size='small' variant='filled'>
                Статистика
              </ButtonComponent>
            </div>
          </div>
        </div>
      </section>
    )
  }

  //return текущий компонент, если настроение задано
  return (
    <section className={`${styles.mood_tracker}`}>
      <h2 className={styles.mood_tracker__title}>Трекер настрою</h2>
      <div className={styles.mood_tracker__box}>
        <div className={styles.mood_tracker__box2}>
          <div className={styles.mood_tracker__bottom}>
            <div
              className={styles.mood_tracker__selected_emotion}
              style={{ backgroundColor: selectedMoodData?.color }}
            >
              {selectedMoodData?.icon}
            </div>
          </div>
          <div className={styles.mood_tracker__top}>
            <span>Останнє оновлення:</span>
            <span className={styles.mood_tracker__time}>
              {moment(user?.mood?.date).isSame(new Date(), 'day')
                ? `Сьогодні ${moment(user?.mood?.date).format('HH:mm')}`
                : moment(user?.mood?.date).format('dddd HH:mm')}
            </span>
          </div>
          <button className={styles.mood_tracker__btn} onClick={goToSelectMood}>
            +
          </button>
        </div>
        <div className={styles.mood_tracker__statistics}>
          <ButtonComponent onClick={goToStatistics} size='small' variant='filled'>
            Статистика
          </ButtonComponent>
        </div>
      </div>
    </section>
  )
}

export default MoodTrackerComponent
