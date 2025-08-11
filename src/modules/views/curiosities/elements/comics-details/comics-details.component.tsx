import React, { useEffect, useState, useRef } from 'react'
import { useUserStore } from '@/shared/stores'
import styles from './comics-details.module.scss'
import { ButtonComponent } from '@/shared/components'
import { LearningDetailsComponent } from '@/modules/views/curiosities/elements'
import { IconArrow } from '@/shared/icons'
import { useRouter } from 'next/navigation'
import i18n from 'i18next'

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
  const [currentImageIndexTab1, setCurrentImageIndexTab1] = useState(0)
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null)
  const [learningData, setLearningData] = useState<any>(null)
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isLearningBlockVisible, setLearningBlockVisible] = useState(true)
  const token = useUserStore((state) => state.user?.access_token) // Токен из хранилища

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchStartXTab1 = useRef(0)
  const touchEndXTab1 = useRef(0)

  useEffect(() => {
    console.log('Текущий рендер, вкладка:', currentTab) // Проверим, что компонент рендерится
    if (currentTab === 2 || currentTab === 4) {
      console.log('Сбрасываю индекс слайдера на 0') // Логируем, когда сбрасываем индекс
      setCurrentImageIndex(0) // Сбрасываем индекс
    }
  }, [currentTab])

  useEffect(() => {
    if (!token) {
      setError('Токен авторизации отсутствует.')
      setLoading(false)
      return
    }

    const fetchComicDetails = async () => {
      try {
        setLoading(true)
        const currentLang = i18n.language
        const langPrefix = currentLang === 'uk' ? 'uk' : 'en'
        const response = await fetch(
          `https://istrongapp.com/${langPrefix}/api/curiosities/comixes/${comicId}`,
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
      const currentLang = i18n.language
      const langPrefix = currentLang === 'uk' ? 'uk' : 'en'
      const response = await fetch(
        `https://istrongapp.com/${langPrefix}/api/techniques/${techniqueId}/`,
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
      const currentLang = i18n.language
      const langPrefix = currentLang === 'uk' ? 'uk' : 'en'
      const response = await fetch(
        `https://istrongapp.com/${langPrefix}/api/curiosities/comixes/${comicId}/learning/`,
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

  const handleSwipeTab1 = () => {
    const threshold = 50 // Порог свайпа для вкладки 1

    const images = comicDetails?.images // Сохраняем в локальную переменную для первой вкладки

    if (!images || images.length === 0) return // Проверка наличия данных

    if (touchStartXTab1.current - touchEndXTab1.current > threshold) {
      // Свайп влево для вкладки 1
      setCurrentImageIndexTab1((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
    } else if (touchEndXTab1.current - touchStartXTab1.current > threshold) {
      // Свайп вправо для вкладки 1
      setCurrentImageIndexTab1((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
    }
  }

  const handleSwipe = () => {
    const threshold = 50 // Порог свайпа

    const images = selectedTechnique?.images // Сохраняем в локальную переменную

    if (!images || images.length === 0) return // Проверка наличия данных

    if (touchStartX.current - touchEndX.current > threshold) {
      // Свайп влево
      setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
    } else if (touchEndX.current - touchStartX.current > threshold) {
      // Свайп вправо
      setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
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
            onTouchStart={(e) => (touchStartXTab1.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              touchEndXTab1.current = e.changedTouches[0].clientX
              handleSwipeTab1()
            }}
          >
            <button onClick={onClose} className={styles.closeButton}>
              <IconArrow />
            </button>
            {comicDetails?.images && comicDetails.images.length > 0 ? (
              <>
                <img
                  src={comicDetails.images[currentImageIndexTab1].image}
                  alt={`Image ${currentImageIndexTab1 + 1}`}
                  className={styles.sliderImage}
                />
                <div className={styles.dots}>
                  {comicDetails.images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${index === currentImageIndexTab1 ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndexTab1(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p>Изображения отсутствуют</p>
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
              {(selectedTechnique?.description ?? '').split('\n').map((line, index) => (
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
                {selectedTechnique.images.length > 1 && (
                  <div className={styles.dots}>
                    {selectedTechnique.images.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p></p>
            )}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}
            >
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
