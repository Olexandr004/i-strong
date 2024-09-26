'use client'
import { motion } from 'framer-motion'

import { FC } from 'react'

import styles from './toggle-btn.module.scss'

// интерфейс
interface IToggleButton {
  isChecked: boolean
  onToggle: () => void
}

// компонент
export const ToggleButtonComponent: FC<Readonly<IToggleButton>> = ({ isChecked, onToggle }) => {
  // возвращение
  return (
    <div className={`${styles.toggle} ${isChecked && styles.active}`} onClick={onToggle}>
      <motion.div
        className={styles.toggle__controller}
        layout
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      />
    </div>
  )
}

export default ToggleButtonComponent
