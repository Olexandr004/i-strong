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
      // Убираем логику закрытия модального окна
      if (isActive) {
        // После возвращения приложения в активное состояние, сбрасываем игнорирование
        setIgnoreNextAppStateChange(false)
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

  const handleCameraOpen = () => {
    // Устанавливаем флаг игнорирования при открытии камеры
    setIgnoreNextAppStateChange(true)
    // Открытие камеры или действия, связанные с использованием системных функций
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
