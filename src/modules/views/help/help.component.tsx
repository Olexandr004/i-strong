'use client'

import Image from 'next/image'
import { FC, useState, useRef, useEffect } from 'react'

import { ButtonComponent } from '@/shared/components'
import { IconArrow } from '@/shared/icons'
import { useRouter } from 'next/navigation'

import styles from './help.module.scss'
import { useTranslation } from 'react-i18next'

interface IHelpComponent {}

export const HelpComponent: FC<Readonly<IHelpComponent>> = () => {
  const router = useRouter()
  const imageSets = [
    ['/image/1-sos.png', '/image/2-sos.png', '/image/3-sos.png', '/image/4-sos.png'],
    ['/image/5-sos.png'],
    [
      '/image/6-sos.png',
      '/image/7-sos.png',
      '/image/8-sos.png',
      '/image/9-sos.png',
      '/image/10-sos.png',
      '/image/11-sos.png',
      '/image/12-sos.png',
      '/image/13-sos.png',
      '/image/14-sos.png',
      '/image/15-sos.png',
      '/image/16-sos.png',
      '/image/17-sos.png',
      '/image/18-sos.png',
      '/image/19-sos.png',
    ],
  ]

  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const { t } = useTranslation()

  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set())

  const currentImages = imageSets[currentSetIndex]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setVisibleImages((prev) => new Set(prev).add(index))
          }
        })
      },
      { threshold: 0.1 },
    )

    const slides = document.querySelectorAll(`.${styles.slide}`)
    slides.forEach((slide) => observer.observe(slide))

    return () => observer.disconnect()
  }, [currentSetIndex])

  const handleNextSet = () => {
    setCurrentSetIndex((prevIndex) => (prevIndex + 1) % imageSets.length) // Следующий массив
    setCurrentSlide(0) // Сбрасываем индекс слайда
    setVisibleImages(new Set()) // Сбрасываем видимые изображения
  }

  const backMain = () => {
    router.push('/')
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    setCurrentSlide((prev) => {
      if (direction === 'left') {
        return (prev - 1 + currentImages.length) % currentImages.length
      }
      return (prev + 1) % currentImages.length
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const deltaX = touchStartX.current - touchEndX.current

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleSwipe('right') // Свайп влево
      } else {
        handleSwipe('left') // Свайп вправо
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const handleCall = () => {
    window.location.href = 'tel: 0800100102'
  }

  return (
    <section className={`${styles.help} container`}>
      <div className={styles.help__top}>
        <button onClick={backMain}>
          <IconArrow />
        </button>
        <h1>SOS</h1>
        <h2>
          {t('help.subtitlePart1')}
          <br />
          {t('help.subtitlePart2')}
        </h2>

        <div
          className={styles.help__wrap}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.slider__content}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {currentImages.map((image, index) => (
              <div
                key={index}
                className={styles.slide}
                style={{ width: '100%' }}
                data-index={index}
              >
                {visibleImages.has(index) && (
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    sizes={'60vw'}
                    width={600}
                    height={600}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderRadius: '24px',
                    }}
                    priority={index === 0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dots}>
          {currentImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dot__active : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <h3>{t('help.question')}</h3>
      <div className={styles.actions}>
        <ButtonComponent onClick={backMain}>{t('help.yes')}</ButtonComponent>
        <ButtonComponent
          onClick={
            currentSetIndex === imageSets.length - 1 ? () => setCurrentSetIndex(0) : handleNextSet
          }
        >
          {currentSetIndex === imageSets.length - 1 ? t('help.restart') : t('help.no')}
        </ButtonComponent>
        <ButtonComponent onClick={handleCall}>{t('help.call')}</ButtonComponent>
      </div>
    </section>
  )
}

export default HelpComponent
