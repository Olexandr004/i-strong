'use client'
import { App, AppState } from '@capacitor/app'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useCommonStore } from '@/shared/stores'
import styles from './base-modal.module.scss'

//interface
interface IBaseModal {
  children: ReactNode
}

//component
export const BaseModalComponent: FC<Readonly<IBaseModal>> = ({ children }) => {
  const isModalActive = useCommonStore((state) => state.isModalActive)
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const [ignoreNextAppStateChange, setIgnoreNextAppStateChange] = useState(false)

  useEffect(() => {
    // Подписываемся на события изменения состояния приложения
    const handleAppStateChange = ({ isActive }: AppState) => {
      if (!isActive && !ignoreNextAppStateChange) {
        // Если приложение сворачивается, и мы не в режиме игнорирования, закрываем модальное окно
        handleChangeCommonStore({ isModalActive: false })
      }
    }

    // Создаем слушатель
    const appStateListenerPromise = App.addListener('appStateChange', handleAppStateChange)

    // Функция очистки
    const cleanup = () => {
      appStateListenerPromise.then((appStateListener) => {
        appStateListener.remove() // Удаляем слушатель изменения состояния приложения
      })
    }

    // Возвращаем функцию очистки
    return cleanup
  }, [handleChangeCommonStore, ignoreNextAppStateChange])

  // Новый useEffect для сброса флага после возвращения в активное состояние
  useEffect(() => {
    const resetIgnoreFlag = ({ isActive }: AppState) => {
      if (isActive) {
        setIgnoreNextAppStateChange(false) // Сбрасываем флаг, если приложение активно
      }
    }

    if (ignoreNextAppStateChange) {
      const listener = App.addListener('appStateChange', resetIgnoreFlag)

      // Возвращаем функцию для отписки от слушателя
      return () => {
        listener.then((appStateListener) => appStateListener.remove())
      }
    }
  }, [ignoreNextAppStateChange])

  const handleCameraOpen = () => {
    // Устанавливаем флаг игнорирования перед открытием камеры
    setIgnoreNextAppStateChange(true)
    // Здесь можно добавить логику для открытия камеры
  }

  //return
  return (
    <AnimatePresence mode={'wait'}>
      {isModalActive && (
        <motion.div
          variants={variants}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          className={styles.modal}
        >
          <div className={styles.modal__box} onClick={(e) => e.stopPropagation()}>
            {children}
            <button onClick={handleCameraOpen}>Open Camera</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BaseModalComponent

const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}
