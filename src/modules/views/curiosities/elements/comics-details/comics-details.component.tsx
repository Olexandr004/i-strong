import React, { useEffect, useState, useRef } from 'react'
import { useUserStore } from '@/shared/stores'
import styles from './comics-details.module.scss'
import { ButtonComponent } from '@/shared/components'
import { LearningDetailsComponent } from '@/modules/views/curiosities/elements'
import { IconArrow } from '@/shared/icons'
import { useRouter } from 'next/navigation'

interface ComicsDetailsComponentProps {
  comicId: string // Assuming comicId is a string, change it if needed
  onClose: () => void // onClose is a function that doesn't return anything
}

interface Technique {
  id: string // или другой тип, если ID не числовой
  name: string // название техники
  description: string
  images?: Array<{ image: string }>
}
interface ComicDetails {
  images: { image: string }[] // Предполагается, что это массив строк (URL изображений)
  name: string
  description: string
  techniques?: Technique[]
}

const ComicsDetailsComponent: React.FC<{ comicId: string | number; onClose: () => void }> = ({
  comicId,
  onClose,
}) => {
  const router = useRouter()
  const [comicDetails, setComicDetails] = useState<ComicDetails | null>(null) // Данные о комиксе
  const [loading, setLoading] = useState(true) // Состояние загрузки
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(1) // Состояние текущей вкладки
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // Индекс текущего изображения
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null)
  const [learningData, setLearningData] = useState<any>(null)
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isLearningBlockVisible, setLearningBlockVisible] = useState(true)
  const token = useUserStore((state) => state.user?.access_token) // Токен из хранилища

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    if (!token) {
      setError('Токен авторизации отсутствует.')
      setLoading(false)
      return
    }

    const fetchComicDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://istrongapp.com/api/curiosities/comixes/${comicId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`)
        }

        const data = await response.json()
        console.log('Полученные данные о комиксе:', data)
        setComicDetails(data.comix)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Неизвестная ошибка')
        }
      } finally {
        setLoading(false) // всегда вызываем setLoading(false) в finally
      }
    }

    fetchComicDetails()
  }, [comicId, token])

  const fetchTechniqueDetails = async (techniqueId: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/techniques/${techniqueId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
      }

      const data = await response.json()
      console.log('Данные о технике:', data)
      setSelectedTechnique(data.technique) // Сохраняем данные о технике
      setCurrentTab(3) // Переключаемся на 4-ю вкладку
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Ошибка при загрузке данных о технике:', err)
        setError(err.message) // Теперь err имеет тип Error, и можно безопасно получить err.message
      } else {
        console.error('Неизвестная ошибка:', err)
        setError('Произошла неизвестная ошибка')
      }
    }
  }

  const fetchLearningDetails = async (type: string) => {
    try {
      const response = await fetch(
        `https://istrongapp.com/api/curiosities/comixes/${comicId}/learning/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
      }

      const data = await response.json()

      // В зависимости от типа, выбираем нужный контент
      setLearningData(data.learning)
      setSelectedContent(type)
      setLearningBlockVisible(true) // Устанавливаем выбранный тип контента
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message) // Безопасно получить err.message
      } else {
        setError('Произошла неизвестная ошибка') // Обработка других типов ошибок
      }
    }
  }
  const handleBackClick = () => {
    setLearningBlockVisible(false) // Скрываем блок
  }

  if (loading) {
    return <p></p>
  }

  if (error) {
    return <p></p>
  }

  if (!comicDetails) {
    return <p></p>
  }
  const handleHomeClick = () => {
    router.push('/')
  }

  const handleSwipe = () => {
    const diff = touchEndX.current - touchStartX.current

    if (diff > 50) {
      // Свайп вправо
      prevImage()
    } else if (diff < -50) {
      // Свайп влево
      nextImage()
    }
  }
  const nextImage = () => {
    if (comicDetails && comicDetails.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % comicDetails.images.length)
    }
  }

  const prevImage = () => {
    if (comicDetails.images.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + comicDetails.images.length) % comicDetails.images.length,
      )
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.comicDetails}>
        <h1>{comicDetails.name}</h1>

        <div className={styles.tabs}>
          <div>
            <button className={`${styles.tabButton} ${currentTab === 1 ? styles.activeTab : ''}`}>
              1
            </button>
          </div>
          <div className={styles.line}></div>
          <div>
            <button className={`${styles.tabButton} ${currentTab === 2 ? styles.activeTab : ''}`}>
              2
            </button>
          </div>
          <div className={styles.line}></div>
          <div>
            <button className={`${styles.tabButton} ${currentTab === 3 ? styles.activeTab : ''}`}>
              3
            </button>
          </div>
          <div className={styles.line}></div>
          <div>
            <button className={`${styles.tabButton} ${currentTab === 4 ? styles.activeTab : ''}`}>
              4
            </button>
          </div>
        </div>

        {currentTab === 1 && (
          <div
            className={styles.tabContent}
            onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              touchEndX.current = e.changedTouches[0].clientX
              handleSwipe()
            }}
          >
            <button onClick={onClose} className={styles.closeButton}>
              <IconArrow />
            </button>
            {comicDetails.images && comicDetails.images.length > 0 ? (
              <>
                <img
                  src={comicDetails.images[currentImageIndex].image}
                  alt={`Image ${currentImageIndex + 1}`}
                  className={styles.sliderImage}
                />
                <div className={styles.dots}>
                  {comicDetails.images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${
                        index === currentImageIndex ? styles.activeDot : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p></p>
            )}
            <ButtonComponent size={'regular'} onClick={() => setCurrentTab(2)}>
              Далі
            </ButtonComponent>
          </div>
        )}

        {currentTab === 2 && (
          <div>
            <button onClick={() => setCurrentTab(1)} className={styles.closeButton}>
              <IconArrow />
            </button>
            <div className={styles.tabContent}>
              <p>{comicDetails.description || 'Описание отсутствует'}</p>
            </div>
            <div className={styles.tabContent}>
              <ul>
                {comicDetails.techniques && comicDetails.techniques.length > 0 ? (
                  comicDetails.techniques.map((technique) => (
                    <li key={technique.id} onClick={() => fetchTechniqueDetails(technique.id)}>
                      {technique.name}
                    </li>
                  ))
                ) : (
                  <p>Технік не знайдено.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {currentTab === 3 && (
          <div
            className={styles.tabContent}
            onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              touchEndX.current = e.changedTouches[0].clientX
              handleSwipe()
            }}
          >
            <button onClick={() => setCurrentTab(2)} className={styles.closeButton}>
              <IconArrow />
            </button>
            <h4>{selectedTechnique?.name}</h4>
            <p>
              {selectedTechnique?.description.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            {selectedTechnique?.images && selectedTechnique.images.length > 0 ? (
              <>
                <img
                  src={selectedTechnique?.images[currentImageIndex].image}
                  alt={`Image ${currentImageIndex + 1}`}
                  className={styles.sliderImage}
                />
                <div className={styles.dots}>
                  {selectedTechnique?.images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p></p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ButtonComponent size={'regular'} onClick={() => setCurrentTab(4)}>
                Далі
              </ButtonComponent>
              <ButtonComponent variant={'outlined'} onClick={() => setCurrentTab(2)}>
                Спробувати іншу техніку
              </ButtonComponent>
            </div>
          </div>
        )}

        {currentTab === 4 && selectedTechnique && (
          <div className={styles.tabContent}>
            <button onClick={() => setCurrentTab(3)} className={styles.closeButton}>
              <IconArrow />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className={styles.btn_comics}
                onClick={() => fetchLearningDetails('what_is_it')}
              >
                Що таке {comicDetails.name}?
              </button>
              <button
                className={styles.btn_comics}
                onClick={() => fetchLearningDetails('what_it_gives')}
              >
                Що дає {comicDetails.name}?
              </button>
              <button className={styles.btn_comics} onClick={() => fetchLearningDetails('tips')}>
                Поради від Капібари
              </button>
              <button
                style={{ marginBottom: '40px' }}
                className={styles.btn_comics}
                onClick={() => fetchLearningDetails('remember')}
              >
                Пам&apos;ятки
              </button>
              <ButtonComponent size={'regular'} onClick={handleHomeClick}>
                Завершити
              </ButtonComponent>
            </div>

            {/* Условный рендеринг для блока */}
            {isLearningBlockVisible && learningData && selectedContent && (
              <div className={styles.learning_block}>
                <button onClick={handleBackClick}>
                  <IconArrow />
                </button>
                <LearningDetailsComponent
                  content={learningData[selectedContent]}
                  type={selectedContent} // передаем тип контента (what_is_it, что дає и т. д.)
                  comicName={comicDetails.name} // передаем имя комикса
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ComicsDetailsComponent
