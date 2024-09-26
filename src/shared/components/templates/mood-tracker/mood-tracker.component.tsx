'use client'
import { useMutation } from '@tanstack/react-query'

import 'moment/locale/uk'
import moment from 'moment'

import { FC, useEffect, useState } from 'react'

import { postMood } from '@/api/mood-tracker'
import { useGetUserProfile } from '@/api/setting-user.api'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'

import styles from './mood-tracker.module.scss'

//interface
interface IMoodTracker {}

//component
export const MoodTrackerComponent: FC<Readonly<IMoodTracker>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)

  const [selectedMood, setSelectedMood] = useState(user?.mood?.mood ?? 'happy')

  const { data: UserProfile, refetch: userProfileRefetch } = useGetUserProfile(token ?? '')

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any, variables) => {
      console.log(data)
      userProfileRefetch().then((data) => {
        handleChangeUserStore({ user: data.data })
      })
    },
  })

  useEffect(() => {
    if (user) {
      setSelectedMood(user?.mood?.mood ?? 'happy')
    }
  }, [user])

  //return
  return (
    <section className={`${styles.mood_tracker}`}>
      <h2 className={styles.mood_tracker__title}>Трекер настрою</h2>

      <div className={styles.mood_tracker__box}>
        <div className={styles.mood_tracker__top}>
          <span>Останнє оновлення:</span>

          <span className={styles.mood_tracker__time}>
            {moment(user?.mood?.date).format('dddd HH:mm')}
          </span>
        </div>

        <div className={styles.mood_tracker__bottom}>
          <div className={styles.mood_tracker__options}>
            <p>Натисни щоб змінити</p>

            <ul className={styles.mood_tracker__emotions}>
              {MOODS.filter((item) => item.slug !== selectedMood).map((item) => (
                <button
                  className={`${styles.mood_tracker__emotion} ${item.slug === selectedMood && styles.active}`}
                  onClick={() => postCurrentMood({ mood: item.slug })}
                  key={item.slug}
                >
                  {item.icon}
                </button>
              ))}
            </ul>
          </div>

          <div className={styles.mood_tracker__selected_emotion}>
            {MOODS.find((item) => item.slug === selectedMood)?.icon}
          </div>
        </div>
      </div>
    </section>
  )
}
export default MoodTrackerComponent
