import { FC } from 'react'

import { IconCoin } from '@/shared/icons'

import styles from './coins-display.module.scss'

export interface ICoin {
  coin?: number
  classPosition?: string
}

const CoinsDisplayComponent: FC<ICoin> = ({ coin, classPosition }) => {
  return (
    <div className={`${styles.coin} ${classPosition}`}>
      <IconCoin />
      <span className={styles.coin__text}>{coin}</span>
    </div>
  )
}

export default CoinsDisplayComponent
