import React, { FC, useState } from 'react'
import styles from './curiosities.module.scss'
import { ComicsListComponent, HistoryComponent } from '@/modules/views/curiosities/elements'

interface CuriositiesComponentProps {}
const CuriositiesComponent: FC<Readonly<CuriositiesComponentProps>> = () => {
  const [showComics, setShowComics] = useState(false)
  const [showHistory, setShowHistory] = useState(false) // Добавляем состояние для отображения историй
  const [title, setTitle] = useState('Цікавинки') // Состояние для заголовка

  const handleComicsClick = () => {
    setShowComics(true)
    setShowHistory(false) // При переключении на комиксы, скрываем истории
    setTitle('Комікси') // Меняем заголовок на "Комікси"
  }

  const handleStoriesClick = () => {
    console.log('Історії обрано')
    setShowComics(false) // При переключении на истории, скрываем комиксы
    setShowHistory(true) // Показываем истории
    setTitle('Історії') // Меняем заголовок на "Історії"
  }

  return (
    <section className={styles.container}>
      {/* Скрываем заголовок, если отображаются комиксы или истории */}
      {!showComics && !showHistory && <h1>{title}</h1>}

      {showComics ? (
        <ComicsListComponent />
      ) : showHistory ? (
        <HistoryComponent /> // Отображаем компонент HistoryComponent, если выбраны истории
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
