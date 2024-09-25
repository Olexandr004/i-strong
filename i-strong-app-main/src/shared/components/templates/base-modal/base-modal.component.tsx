import { AnimatePresence, motion } from 'framer-motion'

import { FC, ReactNode } from 'react'

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
          onClick={() => {
            handleChangeCommonStore({ isModalActive: false })
          }}
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
