'use client'
import { motion } from 'framer-motion'

import { FC, useState } from 'react'

import styles from './toggle-btn.module.scss'

//interface
interface IToggleButton {}

//component
export const ToggleButtonComponent: FC<Readonly<IToggleButton>> = () => {
  const [isOn, setIsOn] = useState(false)

  //return
  return (
    <div className={`${styles.toggle} ${isOn && styles.active}`} onClick={() => setIsOn(!isOn)}>
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
