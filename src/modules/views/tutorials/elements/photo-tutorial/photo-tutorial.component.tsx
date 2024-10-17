import { FC, useState, useRef } from 'react'
import styles from './photo-tutorial.module.scss'

interface IPhotoTutorialComponent {
  array: string[]
}

const PhotoTutorialComponent: FC<IPhotoTutorialComponent> = ({ array }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartRef = useRef<number | null>(null)
  const touchEndRef = useRef<number | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % array.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + array.length) % array.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartRef.current !== null && touchEndRef.current !== null) {
      const distance = touchStartRef.current - touchEndRef.current
      if (distance > 50) {
        nextSlide() // Swipe left
      } else if (distance < -50) {
        prevSlide() // Swipe right
      }
    }
    // Reset touch positions
    touchStartRef.current = null
    touchEndRef.current = null
  }

  return (
    <div
      className={styles.photoTutorial}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.photoTutorial__container}>
        <div className={styles.photoTutorial__slide}>
          <img
            src={array[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className={styles.photoTutorial__image}
          />
        </div>
      </div>

      <div className={styles.photoTutorial__dots}>
        {array.map((_, index) => (
          <button
            key={index}
            className={`${styles.photoTutorial__dot} ${currentIndex === index ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default PhotoTutorialComponent
