import { FC, ReactNode } from 'react'

import styles from './icon-button.module.scss'

//interface
interface IIconButton {
  name: string
  children: ReactNode
  onClick: () => void
}

//component
export const IconButtonComponent: FC<Readonly<IIconButton>> = ({ name, onClick, children }) => {
  //return
  return (
    <button
      aria-label={name}
      type={'button'}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={styles.icon_button}
    >
      {children}
    </button>
  )
}
export default IconButtonComponent
