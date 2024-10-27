import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FC, useState, useEffect, useRef } from 'react'
import { postMood } from '@/api/mood-tracker'
import { ButtonComponent } from '@/shared/components'
import { MOODS } from '@/shared/constants/moods'
import { useUserStore } from '@/shared/stores'
import styles from './select-mood.module.scss'
import { IconArrow } from '@/shared/icons'

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

// компонент
export const SelectMoodComponent: FC<Readonly<ISelectMoodComponent>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>('Чудово') // Установка по умолчанию на "чудово"
  const [selectedAdditionalMoods, setSelectedAdditionalMoods] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [validationImage, setValidationImage] = useState<string | null>(null) // состояние для изображения
  const [showModal, setShowModal] = useState(false) // состояние для отображения модального окна

  const textareaRef = useRef<HTMLTextAreaElement | null>(null) // Ссылка на textarea

  const { mutate: postCurrentMood } = useMutation({
    mutationFn: (form: any) => postMood(token ?? '', form),

    onSuccess: (data: any) => {
      console.log(data)
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

      // Проверяем наличие изображения в ответе
      if (data.validation_image) {
        setValidationImage(data.validation_image)
        setShowModal(true) // Показываем модальное окно
      } else {
        setValidationImage(null)
        router.push('/') // Перенаправляем на главную страницу, если изображение отсутствует
      }
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

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/') // Перейти на главную страницу после закрытия модального окна
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)

    // Изменение высоты
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Сброс высоты перед установкой новой
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Установка новой высоты
    }
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
            className={`${styles.select_mood__emotion} ${
              item.slug === selectedMood ? styles.active : styles.activated
            }`}
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
          ref={textareaRef} // Присваиваем ссылку на textarea
          value={description}
          onChange={handleTextareaChange} // Используем обработчик
          maxLength={1000} // Ограничение на 1000 символов
          style={{ overflow: 'hidden', resize: 'none', minHeight: '54px' }} // Скроем прокрутку
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

      {/* Модальное окно, если выбраны дополнительные эмоции */}
      {validationImage ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <img src={validationImage} alt='Эмоция' />
            <ButtonComponent onClick={handleModalClose}>Зрозуміло</ButtonComponent>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default SelectMoodComponent
