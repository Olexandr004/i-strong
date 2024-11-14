import React, { useState, useEffect } from 'react'
import { BaseModalComponent, ButtonComponent } from '@/shared/components'
import styles from './modal-getting-to-instructions.module.scss'
import { IconNextArrow, IconClose } from '@/shared/icons'

interface IModalGettingToInstructionsComponent {
  title: string
  images: string[]
  buttonText: string
  check: 'challenges' | 'shop' | 'diary' | 'instructions' | 'mood-stats' | 'favorites'
  isModalActive: boolean
  closeModal: () => void
}

export const ModalGettingToInstructionsComponent: React.FC<
  IModalGettingToInstructionsComponent
> = ({ images, buttonText, isModalActive, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Проверка состояния images
  useEffect(() => {
    console.log('Received images array:', images)
  }, [images])

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleConfirmation = () => {
    closeModal()
  }

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  console.log('Current image URL:', images[currentImageIndex])

  return (
    <>
      {isModalActive && (
        <div className={styles.modal}>
          <div className={styles.modal__image}>
            <img
              src={images[currentImageIndex]}
              alt='Guide'
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <div className={styles.modal__controls}>
              <button onClick={handlePrevImage} className={styles.modal__prev_button}>
                <IconNextArrow />
              </button>
              <button onClick={handleNextImage} className={styles.modal__next_button}>
                <IconNextArrow />
              </button>
            </div>
            <div className={styles.modal__dots}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.modal__dot} ${currentImageIndex === index ? styles.active : ''}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            <IconClose onClick={handleConfirmation} className={styles.iconclose}>
              {buttonText}
            </IconClose>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalGettingToInstructionsComponent
