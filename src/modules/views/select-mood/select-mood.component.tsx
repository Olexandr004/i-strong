'use client'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { FC, useState } from 'react'

import { postMood } from '@/api/mood-tracker'
import { ButtonComponent } from '@/shared/components'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'

import styles from './select-mood.module.scss'

//interface
interface ISelectMood {}

//component
export const SelectMoodComponent: FC<Readonly<ISelectMood>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>()

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any) => {
      console.log(data)
    },
  })

  const handleSubmitMood = () => {
    postCurrentMood({ mood: selectedMood })
    router.push('/')
  }

  //return
  return (
    <section
      className={`
      ${styles.select_mood} 
      ${selectedMood === 'angry' && styles.red} 
      ${selectedMood === 'sad' && styles.blue} 
      ${selectedMood === 'normal' && styles.green}  
      ${selectedMood === 'happy' && styles.yellow} 
      container`}
    >
      <div className={styles.select_mood__head}>
        <h1 className={`title`}>
          Як ти себе <br /> почуваєш?
        </h1>

        <p className={styles.select_mood__subtitle}>
          Відзнач свій настрій відповідним
          <br /> смайликом
        </p>
      </div>

      <div className={`${styles.select_mood__emotions} `}>
        {MOODS.map((item) => (
          <button
            className={`${styles.select_mood__emotion} ${selectedMood && styles.activated} ${item.slug === selectedMood && styles.active}`}
            onClick={() => setSelectedMood(item.slug)}
            key={item.slug}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className={styles.select_mood__buttons}>
        <ButtonComponent onClick={handleSubmitMood} disabled={!selectedMood}>
          Зберегти
        </ButtonComponent>

        <ButtonComponent variant={'outlined'} onClick={() => router.push('/help')}>
          Отримати допомогу
        </ButtonComponent>
      </div>
    </section>
  )
}
export default SelectMoodComponent
