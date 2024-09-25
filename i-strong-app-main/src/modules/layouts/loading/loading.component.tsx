'use client'
import { FC } from 'react'

import { IconLogo } from '@/shared/icons'

import styles from './loading.module.scss'

interface ILoadingComponent {
  variant?: 'fixed' | 'absolute'
}

// component
const LoadingComponent: FC<Readonly<ILoadingComponent>> = ({ variant = 'fixed' }) => {
  // return
  return (
    <div className={styles.loading} style={{ position: variant }}>
      <div className={styles.loading__logo}>
        <IconLogo />
      </div>
    </div>
  )
}

export default LoadingComponent
