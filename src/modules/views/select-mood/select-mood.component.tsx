import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { postMood } from '@/api/mood-tracker'
import { ButtonComponent } from '@/shared/components'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'
import styles from './select-mood.module.scss'
import { IconArrow } from '@/shared/icons'

// Список дополнительных эмоций
const ADDITIONAL_MOODS = [
  'Сором',
  'Відраза',
  'Напруження',
  'Розгубленість',
  'Сум',
  'Втома',
  'Страх',
  'Злість',
  'Самотність',
  'Провина',
  'Хвилювання',
  'Надія',
  'Задоволення',
  'Вдячність',
  'Спокій',
  'Здивування',
  'Радість',
  'Щастя',
]

// компонент
export const SelectMoodComponent: FC<Readonly<{}>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>()
  const [selectedAdditionalMoods, setSelectedAdditionalMoods] = useState<string[]>([])

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any) => {
      console.log(data)
      // Обновляем состояние в Zustand
      handleChangeUserStore({
        user: {
          id: user?.id ?? 0, // Предоставьте значение по умолчанию
          name: user?.name ?? '', // Предоставьте значение по умолчанию
          phone_number: user?.phone_number ?? '', // Предоставьте значение по умолчанию
          access_token: user?.access_token ?? '', // Предоставьте значение по умолчанию
          coins: user?.coins ?? 0, // Предоставьте значение по умолчанию
          avatar: user?.avatar ?? null, // Предоставьте значение по умолчанию
          mood: {
            mood: selectedMood!,
            date: new Date().toISOString(),
          },
          has_dairy_password: user?.has_dairy_password ?? false, // Предоставьте значение по умолчанию
          activity: {
            challenges_visited: user?.activity?.challenges_visited ?? false,
            diary_visited: user?.activity?.diary_visited ?? false,
            id: user?.activity?.id ?? 0, // Предоставьте значение по умолчанию
            instructions_visited: user?.activity?.instructions_visited ?? false,
            mood_stats_visited: user?.activity?.mood_stats_visited ?? false,
            shop_visited: user?.activity?.shop_visited ?? false,
          },
        },
      })
    },
  })

  const handleSubmitMood = () => {
    postCurrentMood({ mood: selectedMood, additionalMoods: selectedAdditionalMoods })
    router.push('/')
  }

  const toggleAdditionalMood = (mood: string) => {
    setSelectedAdditionalMoods((prev) =>
      prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood],
    )
  }

  //return
  return (
    <section className={`${styles.select_mood} ${selectedMood && styles.active}`}>
      <div className={styles.select_mood__head}>
        <h1 className={styles.title}>
          Як ти себе <br /> почуваєш?
        </h1>
      </div>

      <div className={styles.select_mood__emotions}>
        {MOODS.map((item) => (
          <button
            className={`${styles.select_mood__emotion} ${selectedMood && styles.activated} ${item.slug === selectedMood && styles.active}`}
            onClick={() => setSelectedMood(item.slug)}
            key={item.slug}
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 2rem' }}>
        <h2>Я відчуваю:</h2>
        <div className={styles.additional_moods}>
          {ADDITIONAL_MOODS.map((mood) => (
            <button
              key={mood}
              className={`${styles.additional_mood} ${selectedAdditionalMoods.includes(mood) ? styles.active : ''}`}
              onClick={() => toggleAdditionalMood(mood)}
            >
              <span>{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <label htmlFor='Why-do-I-feel-this-way?'>Чому я так почуваюсь?</label>
        <textarea name='Why-do-I-feel-this-way?' id='Why-do-I-feel-this-way?'></textarea>
      </div>

      <div className={styles.select_mood__buttons}>
        <ButtonComponent onClick={handleSubmitMood} disabled={!selectedMood}>
          Зберегти
        </ButtonComponent>
      </div>
      <button className={styles.backBtn} onClick={() => router.push('/')}>
        <IconArrow />
      </button>
    </section>
  )
}

export default SelectMoodComponent
