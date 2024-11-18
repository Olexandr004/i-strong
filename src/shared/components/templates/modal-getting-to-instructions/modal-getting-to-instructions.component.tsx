import React, { useState, useEffect, useRef } from 'react'
import styles from './modal-getting-to-instructions.module.scss'
import { IconClose } from '@/shared/icons'

interface IModalGettingToInstructionsComponent {
  title: string
  images: string[]
  buttonText: string
  check: 'challenges' | 'shop' | 'diary' | 'techniques' | 'mood-stats' | 'favorites'
  isModalActive: boolean
  closeModal: () => void
}

export const ModalGettingToInstructionsComponent: React.FC<
  IModalGettingToInstructionsComponent
> = ({ images, buttonText, isModalActive, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Закрытие модального окна при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    if (isModalActive) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalActive, closeModal])

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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      setTouchStartX(null)
    } else if (touchDiff < -50) {
      // Свайп вправо
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
      setTouchStartX(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartX(null)
  }

  return (
    <>
      {isModalActive && (
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
              <div className={styles.modal__image}>
                <img
                  src={images[currentImageIndex]}
                  alt='Guide'
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {images.length > 1 && (
                  <div className={styles.modal__dots}>
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.modal__dot} ${currentImageIndex === index ? styles.active : ''}`}
                        onClick={() => handleDotClick(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <IconClose onClick={closeModal} className={styles.iconclose}>
                {buttonText}
              </IconClose>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ModalGettingToInstructionsComponent
