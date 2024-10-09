'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './offline.module.scss'
import { IconArrow } from '@/shared/icons'

const OfflinePage: React.FC = () => {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false) // Изначально считаем, что интернет отсутствует

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Проверяем текущее состояние сети при монтировании компонента
    setIsOnline(navigator.onLine)

    // Удаляем обработчики событий при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleBackClick = () => {
    if (isOnline) {
      router.back() // Возвращаем пользователя на предыдущую страницу
    }
  }

  return (
    <div className={styles.offline}>
      <h1>Упс!</h1>
      <p>Здається щось пішло не так!</p>
      <img src='/image/error-text.png' alt='error-text' className={styles.error_text} />
      <img src='/image/error-capibara.png' alt='error-capibara' className={styles.error_capibara} />

      <button
        className={`${styles.backButton} ${!isOnline ? styles.disabled : ''}`}
        onClick={handleBackClick}
        disabled={!isOnline} // Блокируем кнопку, если нет соединения
      >
        <IconArrow></IconArrow>
      </button>
    </div>
  )
}

export default OfflinePage
