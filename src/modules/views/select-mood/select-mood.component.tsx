import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FC, useState, useEffect, useRef, useMemo } from 'react'
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

export const SelectMoodComponent: FC<Readonly<ISelectMoodComponent>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  const [selectedMood, setSelectedMood] = useState<string>('Чудово')
  const [selectedAdditionalMoods, setSelectedAdditionalMoods] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [validationImage, setValidationImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
          activity: user?.activity ?? {
            challenges_visited: false,
            diary_visited: false,
            id: 0,
            instructions_visited: false,
            mood_stats_visited: false,
            shop_visited: false,
          },
        },
      })

      if (data.validation_image) {
        setValidationImage(data.validation_image)
        setShowModal(true)
      } else {
        setValidationImage(null)
        router.push('/')
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
    router.push('/')
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const MemoizedTextarea = useMemo(() => {
    return (
      <textarea
        name='description'
        id='description'
        ref={textareaRef}
        value={description}
        onChange={handleTextareaChange}
        maxLength={1000}
        style={{ overflow: 'hidden', resize: 'none', minHeight: '54px' }}
      />
    )
  }, [description])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = '0'
      document.body.style.left = '0'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [showModal])

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
        {MemoizedTextarea}
      </div>

      <div className={styles.select_mood__buttons}>
        <ButtonComponent onClick={handleSubmitMood} disabled={!selectedMood}>
          Зберегти
        </ButtonComponent>
      </div>

      <button className={styles.backBtn} onClick={() => router.push('/')}>
        <IconArrow />
      </button>

      {validationImage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <img src={validationImage} alt='Эмоция' />
            <ButtonComponent onClick={handleModalClose}>Зрозуміло</ButtonComponent>
          </div>
        </div>
      )}
    </section>
  )
}

export default SelectMoodComponent
