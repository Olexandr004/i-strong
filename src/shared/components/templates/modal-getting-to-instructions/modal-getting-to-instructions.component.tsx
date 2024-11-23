import React, { useState, useEffect, useRef } from 'react'
import styles from './modal-getting-to-instructions.module.scss'
import { IconClose } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

interface IModalGettingToInstructionsComponent {
  title: string
  images: string[]
  buttonText: string
  check: 'challenges' | 'wardrobe' | 'diary' | 'techniques' | 'mood-stats' | 'favorites'
  isModalActive: boolean
  closeModal: () => void
}

export const ModalGettingToInstructionsComponent: React.FC<
  IModalGettingToInstructionsComponent
> = ({ images, buttonText, check, isModalActive, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [fetchedImages, setFetchedImages] = useState<string[]>([]) // Храним изображения из API
  const token = useUserStore((state) => state.user?.access_token)

  // Проверяем первый визит
  useEffect(() => {
    const visitedKey = `${check}_visited`
    const hasVisited = localStorage.getItem(visitedKey)

    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem(visitedKey, 'true')
      updateActivity(check)
      fetchGuideImages(check) // Загружаем изображения
    }
  }, [check])

  // Функция для получения изображений из API
  const fetchGuideImages = async (guideType: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/guides/${guideType}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      console.log('Fetched guide data:', data) // Логируем полный ответ от сервера

      // Проверяем, что данные содержат изображения
      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setFetchedImages(images) // Сохраняем массив изображений
      } else {
        console.error('Формат ответа некорректен или изображения отсутствуют:', data.guide?.images)
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error)
    }
  }

  // Закрытие модального окна при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModalWithReset() // закрытие модалки при клике вне
      }
    }

    if (isModalActive || isFirstVisit) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalActive, isFirstVisit])

  const closeModalWithReset = () => {
    closeModal()
    setIsFirstVisit(false) // сбросить первый визит
  }

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartX) return

    const touchEndX = event.touches[0].clientX
    const touchDiff = touchStartX - touchEndX

    if (touchDiff > 50) {
      // Свайп влево
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeImages.length)
      setTouchStartX(null)
    } else if (touchDiff < -50) {
      // Свайп вправо
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + activeImages.length) % activeImages.length,
      )
      setTouchStartX(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartX(null)
  }

  // Обновление активности через API
  const updateActivity = async (activityType: string) => {
    try {
      const token = localStorage.getItem('access_token') // Получение токена
      const response = await fetch(`http://127.0.0.1:8000/api/users/activities/${activityType}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to update activity')
      }
    } catch (error) {
      console.error('Error updating activity:', error)
    }
  }

  // Определяем, какие изображения использовать
  const activeImages = fetchedImages.length > 0 ? fetchedImages : images

  return (
    <>
      {(isModalActive || isFirstVisit) && (
        <>
          {/* Слой-подложка */}
          <div className={styles.modal__backdrop} />

          {/* Модальное окно */}
          <div className={styles.modal}>
            <div
              ref={modalRef}
              className={styles.modal__content}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {activeImages.length > 0 ? (
                <>
                  <div className={styles.modal__image}>
                    <img
                      src={activeImages[currentImageIndex]}
                      alt='Guide'
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    {activeImages.length > 1 && (
                      <div className={styles.modal__dots}>
                        {activeImages.map((_, index) => (
                          <button
                            key={index}
                            className={`${styles.modal__dot} ${
                              currentImageIndex === index ? styles.active : ''
                            }`}
                            onClick={() => handleDotClick(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button className={styles.modal__button} onClick={closeModal}>
                    {buttonText}
                  </button>
                </>
              ) : (
                <div className={styles.noContent}>Нет доступных изображений</div> // Если изображений нет
              )}
              <IconClose onClick={closeModalWithReset} className={styles.iconclose} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ModalGettingToInstructionsComponent
