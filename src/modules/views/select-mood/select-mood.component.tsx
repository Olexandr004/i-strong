import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { postMood } from '@/api/mood-tracker'
import { ButtonComponent } from '@/shared/components'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'
import styles from './select-mood.module.scss'
import { IconArrow } from '@/shared/icons'

interface ISelectMoodComponent {}

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
export const SelectMoodComponent: FC<Readonly<ISelectMoodComponent>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>()
  const [selectedAdditionalMoods, setSelectedAdditionalMoods] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [validationImage, setValidationImage] = useState<string | null>(null) // состояние для изображения

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any) => {
      console.log(data)
      // Обновляем состояние в Zustand
      handleChangeUserStore({
        user: {
          id: user?.id ?? 0,
          name: user?.name ?? '',
          phone_number: user?.phone_number ?? '',
          access_token: user?.access_token ?? '',
          coins: user?.coins ?? 0,
          avatar: user?.avatar ?? null,
          mood: {
            mood: selectedMood!,
            date: new Date().toISOString(),
          },
          has_dairy_password: user?.has_dairy_password ?? false,
          activity: {
            challenges_visited: user?.activity?.challenges_visited ?? false,
            diary_visited: user?.activity?.diary_visited ?? false,
            id: user?.activity?.id ?? 0,
            instructions_visited: user?.activity?.instructions_visited ?? false,
            mood_stats_visited: user?.activity?.mood_stats_visited ?? false,
            shop_visited: user?.activity?.shop_visited ?? false,
          },
        },
      })

      // Устанавливаем изображение в зависимости от выбранной эмоции
      if (data.validation_image) {
        setValidationImage(data.validation_image)
      } else {
        setValidationImage(null)
      }
    },

    onError: (error) => {
      console.error('Ошибка при сохранении настроения:', error)
      // Обработка ошибок
    },
  })

  const handleSubmitMood = () => {
    if (!selectedMood) return // Не отправлять запрос, если настроение не выбрано

    postCurrentMood({
      mood: selectedMood,
      description: description,
      emotions: selectedAdditionalMoods, // Эмоции, если они есть
    })
  }

  const toggleAdditionalMood = (mood: string) => {
    setSelectedAdditionalMoods((prev) =>
      prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood],
    )
  }

  // return
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
            className={`${styles.select_mood__emotion} ${item.slug === selectedMood ? styles.active : styles.activated}`}
            onClick={() => setSelectedMood(item.slug)}
            key={item.slug}
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>

      {/* Показываем изображение, если оно есть */}
      {validationImage && (
        <div className={styles.validationImage}>
          <img src={validationImage} alt='Эмоция' />
        </div>
      )}

      <div style={{ padding: '0 2rem' }}>
        <h2>Я відчуваю:</h2>
        <div className={styles.additional_moods}>
          {ADDITIONAL_MOODS.map((mood) => (
            <button
              key={mood}
              className={`${styles.additional_mood} ${selectedAdditionalMoods.includes(mood) ? styles.active : ''} ${selectedMood ? styles.activated : ''}`}
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
          name='description'
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000} // Ограничение на 1000 символов
        />
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
