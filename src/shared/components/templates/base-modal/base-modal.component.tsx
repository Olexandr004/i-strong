import { App, AppState } from '@capacitor/app'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useEffect } from 'react'
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

  useEffect(() => {
    // Подписываемся на события изменения состояния приложения
    const handleAppStateChange = ({ isActive }: AppState) => {
      if (!isActive) {
        // Если приложение сворачивается, закрываем модальное окно
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
  }, [handleChangeCommonStore])

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
