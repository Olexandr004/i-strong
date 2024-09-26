'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent } from '@/shared/components'
import { ImageCapybara } from '@/shared/images'

import styles from './welcome.module.scss'

interface IWelcomeComponent {}

//component
export const WelcomeComponent: FC<Readonly<IWelcomeComponent>> = () => {
  const router = useRouter()
  return (
    <section className={`${styles.welcome} container`}>
      <div className={styles.welcome__top}>
        <h1 className={`${styles.welcome__top_title} title`}>Вітаю у IStrong!</h1>

        <p className={`${styles.welcome__top_greeting} text-2`}>
          Я буду твоїм особистим помічником і допоможу з будь-якими труднощами
        </p>

        <div className={styles.welcome__image}>
          <Image
            src={ImageCapybara}
            alt={`Capybara`}
            // className={styles.welcome__top_img}
            sizes={'90vw'}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            priority
          />
        </div>
      </div>

      <ButtonComponent
        onClick={() => {
          router.push('/select-mood')
        }}
      >
        Привіт!
      </ButtonComponent>
    </section>
  )
}
export default WelcomeComponent
