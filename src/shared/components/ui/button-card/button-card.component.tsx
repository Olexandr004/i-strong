import { FC, ReactNode } from 'react'

import styles from './button-card.module.scss'

//interface
interface IButtonCard {
  children: ReactNode
  completedCount: boolean
  onClick: () => void
}

//component
export const ButtonCardComponent: FC<Readonly<IButtonCard>> = ({
  children,
  completedCount,
  onClick,
}) => {
  //return
  return (
    <button
      className={`${styles.button} ${completedCount && styles.active} text-6`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export default ButtonCardComponent
