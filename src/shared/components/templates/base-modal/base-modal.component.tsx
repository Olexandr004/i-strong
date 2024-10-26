'use client'
import { App, AppState } from '@capacitor/app'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useCommonStore } from '@/shared/stores'
import { usePathname } from 'next/navigation'
import styles from './base-modal.module.scss'

interface IBaseModal {
  children: ReactNode
}

export const BaseModalComponent: FC<Readonly<IBaseModal>> = ({ children }) => {
  const isModalActive = useCommonStore((state) => state.isModalActive)
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const pathname = usePathname() // Получаем текущий путь
  const [prevPathname, setPrevPathname] = useState(pathname) // Состояние для хранения предыдущего пути

  // Обработка изменений состояния приложения
  useEffect(() => {
    const handleAppStateChange = ({ isActive }: AppState) => {
      if (!isActive) {
        handleChangeCommonStore({ isModalActive: false })
      }
    }

    const appStateListenerPromise = App.addListener('appStateChange', handleAppStateChange)

    return () => {
      appStateListenerPromise.then((appStateListener) => {
        appStateListener.remove()
      })
    }
  }, [handleChangeCommonStore])

  // Закрытие модального окна при смене страницы
  useEffect(() => {
    if (prevPathname !== pathname) {
      console.log('Pathname changed, closing modal...') // Лог при смене пути
      handleChangeCommonStore({ isModalActive: false }) // Закрываем модалку
    }
    setPrevPathname(pathname) // Обновляем предыдущее значение пути
  }, [pathname]) // Убираем prevPathname из зависимостей

  // Отладка состояния модального окна
  useEffect(() => {
    console.log('Modal active state:', isModalActive)
  }, [isModalActive])

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
