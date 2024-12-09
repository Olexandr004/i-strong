import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/shared/stores'
import styles from './history.module.scss'
import { IconNextArrow, IconArrow } from '@/shared/icons'

interface Story {
  id: number
  name: string
}

interface StoryContent {
  story: {
    id: number
    name: string
    image: string
    content: string
  }
}

const HistoryComponent: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<StoryContent | null>(null) // Состояние для выбранной истории
  const token = useUserStore((state) => state.user?.access_token) // Получение токена из хранилища

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('https://istrongapp.com/api/curiosities/stories/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Если токен нужен для авторизации
          },
        })

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`)
        }

        const data = await response.json()
        console.log('Полученные истории:', data)
        setStories(data.stories || [])
      } catch (err: any) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Произошла неизвестная ошибка')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [token])

  const fetchStoryContent = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`https://istrongapp.com/api/curiosities/stories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
      }

      const data = await response.json()
      console.log('Полученные данные истории:', data)
      setSelectedStory(data)
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Произошла неизвестная ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedStory(null) // Возвращаемся к списку историй
  }

  return (
    <div className={styles.history}>
      {loading && <p></p>}
      {error && <p style={{ color: 'red' }}></p>}

      {/* Условно показываем заголовок */}
      {!selectedStory && <h1>Історії</h1>}

      {selectedStory ? (
        <div className={styles.storyContent}>
          <button className={styles.backButton} onClick={handleBackToList}>
            <IconArrow />
          </button>
          <h1>{selectedStory.story.name}</h1>
          {selectedStory.story.image && (
            <img
              src={selectedStory.story.image}
              alt={selectedStory.story.name}
              className={styles.storyImage}
            />
          )}
          <div
            className={styles.storyContentText}
            dangerouslySetInnerHTML={{ __html: selectedStory.story.content }}
          />
        </div>
      ) : (
        <ul>
          {stories.map((story) => (
            <li key={story.id} onClick={() => fetchStoryContent(story.id)}>
              {story.name}
              <IconNextArrow />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HistoryComponent
