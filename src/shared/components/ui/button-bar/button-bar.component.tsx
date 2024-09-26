import React from 'react'

import { ChallengeType } from '@/interfaces/challenge'

import styles from './button-bar.module.scss'

interface IButtonInfo {
  id: string
  text: string
  isActive: boolean
}

type IButtonType = ChallengeType | string

interface IButtonBar {
  buttons: IButtonInfo[]
  onButtonClick: (id: IButtonType) => void
}

const ButtonBarComponent: React.FC<IButtonBar> = ({ buttons, onButtonClick }) => {
  return (
    <div className={styles.bar}>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onButtonClick(button.id)}
          className={`${styles.bar__btn} ${button.isActive ? `${styles.active}` : ''} text-4`}
        >
          {button.text}
        </button>
      ))}
    </div>
  )
}

export default ButtonBarComponent
