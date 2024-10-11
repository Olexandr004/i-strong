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

  // Закрытие модального окна при обновлении страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleChangeCommonStore({ isModalActive: false })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleChangeCommonStore])

  // Сброс состояния модального окна при монтировании компонента
  useEffect(() => {
    handleChangeCommonStore({ isModalActive: false }) // Сброс состояния при монтировании
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
