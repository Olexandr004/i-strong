import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { postMood } from '@/api/mood-tracker'
import { ButtonComponent } from '@/shared/components'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'
import styles from './select-mood.module.scss'

interface ISelectMoodComponent {}

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

export const SelectMoodComponent: FC<Readonly<ISelectMoodComponent>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>('Чудово')
  const [description, setDescription] = useState<string>('')
  const [selectedAdditionalMoods, setSelectedAdditionalMoods] = useState<string[]>([])

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),
    onSuccess: () => {
      router.push('/')
    },
    onError: (error) => {
      console.error('Ошибка при сохранении настроения:', error)
    },
  })

  const handleSubmitMood = () => {
    if (!selectedMood) return
    postCurrentMood({
      mood: selectedMood,
      description: description,
      emotions: selectedAdditionalMoods,
    })
  }

  const toggleAdditionalMood = (mood: string) => {
    setSelectedAdditionalMoods((prev) =>
      prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood],
    )
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <section className={styles.select_mood}>
      <div className={styles.select_mood__head}>
        <h1 className={styles.title}>
          Як ти себе <br /> почуваєш?
        </h1>
      </div>

      <div className={styles.select_mood__emotions}>
        {MOODS.map((item) => (
          <button
            className={item.slug === selectedMood ? styles.active : styles.select_mood__emotion}
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
              className={
                selectedAdditionalMoods.includes(mood) ? styles.active : styles.additional_mood
              }
              onClick={() => toggleAdditionalMood(mood)}
            >
              <span>{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <label htmlFor='description'>Чому я так почуваюсь?</label>
        <textarea
          id='description'
          value={description}
          onChange={handleTextareaChange}
          maxLength={1000}
          style={{ overflow: 'auto', resize: 'none', minHeight: '54px' }}
        />
      </div>

      <div className={styles.select_mood__buttons}>
        <ButtonComponent onClick={handleSubmitMood} disabled={!selectedMood}>
          Зберегти
        </ButtonComponent>
      </div>

      <button className={styles.backBtn} onClick={() => router.push('/')}>
        Назад
      </button>
    </section>
  )
}

export default SelectMoodComponent
