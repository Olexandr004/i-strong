import { FC, ReactNode } from 'react'

import styles from './button.module.scss'

//interface
interface IButton {
  type?: 'button' | 'submit' | 'reset' | undefined
  children: ReactNode
  disabled?: boolean
  variant?: 'outlined' | 'filled'
  onClick?: () => void
  size?: 'small' | 'regular'
}

//component
export const ButtonComponent: FC<Readonly<IButton>> = ({
  variant = 'filled',
  type = 'button',
  children,
  disabled,
  onClick,
  size,
}) => {
  //return
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${variant === 'outlined' && styles.outlined} ${size === 'small' && styles.small}`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
export default ButtonComponent
