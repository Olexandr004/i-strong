import React, { FC, useState } from 'react'
import { IconGuides } from '@/shared/icons'
import { ModalGettingToInstructionsComponent } from '@/shared/components'
import { useCommonStore, useUserStore } from '@/shared/stores'
import styles from './curiosities.module.scss'
import { ComicsListComponent, HistoryComponent } from '@/modules/views/curiosities/elements'

interface CuriositiesComponentProps {}
const CuriositiesComponent: FC<Readonly<CuriositiesComponentProps>> = () => {
  const [showComics, setShowComics] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [title, setTitle] = useState('Цікавинки')

  const [guideImages, setGuideImages] = useState<string[]>([])
  const { isModalActive, modalContent, handleChangeCommonStore } = useCommonStore((state) => ({
    isModalActive: state.isModalActive,
    modalContent: state.modalContent,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))
  const token = useUserStore((state) => state.user?.access_token)

  const fetchGuideImages = async (guideType: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/guides/${guideType}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setGuideImages(images)
      }
    } catch (error) {
      console.error('Ошибка при запросе изображений:', error)
    }
  }

  const handleIconGuidesClick = () => {
    handleChangeCommonStore({ isModalActive: true, modalContent: 'curiosities' })
    fetchGuideImages('curiosities')
  }

  const handleComicsClick = () => {
    setShowComics(true)
    setShowHistory(false)
    setTitle('Комікси')
  }

  const handleStoriesClick = () => {
    setShowComics(false)
    setShowHistory(true)
    setTitle('Історії')
  }

  const handleBack = () => {
    setShowComics(false)
    setShowHistory(false)
    setTitle('Цікавинки')
  }

  return (
    <section className={styles.container}>
      {!showComics && !showHistory && <h1>{title}</h1>}
      {!showComics && !showHistory && (
        <div className={styles.iconGuides} onClick={handleIconGuidesClick}>
          <IconGuides />
        </div>
      )}
      {showComics ? (
        <ComicsListComponent onBack={handleBack} />
      ) : showHistory ? (
        <HistoryComponent onBack={handleBack} />
      ) : (
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleComicsClick}>
            Комікси
          </button>
          <button className={styles.button} onClick={handleStoriesClick}>
            Історії
          </button>
        </div>
      )}
      <ModalGettingToInstructionsComponent
        title='Цікавинки - розділ для цікавих історій та коміксів'
        images={guideImages}
        check='curiosities'
        isModalActive={isModalActive}
        closeModal={() => handleChangeCommonStore({ isModalActive: false })}
      />
    </section>
  )
}

export default CuriositiesComponent
