import React, { useState, useEffect } from 'react'
import { BaseModalComponent, ButtonComponent } from '@/shared/components'
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

  console.log('Current image URL:', images[currentImageIndex])

  return (
    <>
      {isModalActive && (
        <div className={styles.modal}>
          <div
            className={styles.modal__image}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt='Guide'
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <div className={styles.modal__dots}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.modal__dot} ${currentImageIndex === index ? styles.active : ''}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            <IconClose onClick={closeModal} className={styles.iconclose}>
              {buttonText}
            </IconClose>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalGettingToInstructionsComponent
