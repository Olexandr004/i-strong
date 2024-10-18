import React from 'react'
import { IconArrow } from '@/shared/icons'
import { useChestStore } from '@/shared/stores'
import styles from './chest.module.scss'

const ChestComponent: React.FC = () => {
  // Используем состояние из zustand-хранилища
  const { view, setView } = useChestStore()

  // Функция для возврата на главную страницу
  const goBack = () => setView('main')

  // Рендеринг основного содержимого в зависимости от выбранного состояния
  const renderContent = () => {
    switch (view) {
      case 'techniques':
        return (
          <div className={styles.box__chest}>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>Техніки</h1>
          </div>
        )
      case 'diary':
        return (
          <div className={styles.box__chest}>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>Щоденник</h1>
          </div>
        )
      default:
        return (
          <div className={styles.box__chest}>
            <h1>Скарбничка</h1>
            <button onClick={() => setView('techniques')}>Техніки</button>
            <button onClick={() => setView('diary')}>Щоденник</button>
          </div>
        )
    }
  }

  return <div className={styles.container__chest}>{renderContent()}</div>
}

export default ChestComponent
