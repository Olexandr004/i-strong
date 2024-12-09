import React, { FC, useState } from 'react'
import styles from './curiosities.module.scss'
import { ComicsListComponent } from '@/modules/views/curiosities/elements'

interface CuriositiesComponentProps {}
const CuriositiesComponent: FC<Readonly<CuriositiesComponentProps>> = () => {
  const [showComics, setShowComics] = useState(false)
  const [title, setTitle] = useState('Цікавинки') // Состояние для заголовка

  const handleComicsClick = () => {
    setShowComics(true)
    setTitle('Комікси') // Меняем заголовок на "Комікси"
  }

  const handleStoriesClick = () => {
    console.log('Історії обрано')
    setShowComics(false)
    setTitle('Історії') // Меняем заголовок на "Історії"
    // Добавьте логику для перехода к историям
  }

  return (
    <section className={styles.container}>
      {/* Скрываем заголовок, если отображаются комиксы */}
      {!showComics && <h1>{title}</h1>}

      {showComics ? (
        <ComicsListComponent />
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
    </section>
  )
}

export default CuriositiesComponent
