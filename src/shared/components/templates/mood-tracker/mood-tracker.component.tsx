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

// компонент
export const MoodTrackerComponent: FC<Readonly<{}>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const selectedMood = user?.mood?.mood ?? 'happy'

  const { data: UserProfile, refetch: userProfileRefetch } = useGetUserProfile(token ?? '')

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any) => {
      console.log(data)
      userProfileRefetch().then((data) => {
        handleChangeUserStore({ user: data.data })
      })
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

  //return
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
              {moment(user?.mood?.date).format('dddd HH:mm')}
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
