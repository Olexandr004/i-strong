'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FC } from 'react'
import ky from 'ky'

import { ChallengeType } from '@/interfaces/challenge'
import { AvatarComponent } from '@/modules/views/profile/elements'
import { ButtonComponent, CoinsDisplayComponent } from '@/shared/components'
import { IconChallenge, IconSetting, IconShop, IconArrow } from '@/shared/icons' // Импортируем IconArrow
import { ImageAvatar } from '@/shared/images'
import { useCommonStore, useUserStore } from '@/shared/stores'

import styles from './profile.module.scss'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
//interface
interface IProfile {}

const tr = i18n.t

const PROFILE_LINKS = (activeChallengeTypeButton: ChallengeType) => [
  {
    title: tr('profile.challenges'),
    icon: <IconChallenge />,
    link: `/challenges?path=${activeChallengeTypeButton}`,
  },
  { title: tr('profile.fashion'), icon: <IconShop />, link: '/store' },
  { title: tr('profile.settings'), icon: <IconSetting />, link: '/settings' },
]

// Функция для получения аватарки с сервера
const fetchUserAvatar = async (token: string) => {
  try {
    const response = await ky
      .get('https://istrongapp.com/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем заголовок с токеном
        },
      })
      .json<{ avatar: string }>()
    const url = response.avatar // URL аватара
    console.log('IMAGE URL = ' + url)

    // Second request to access image
    const fileResponse = await ky.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!fileResponse.ok) {
      console.error('Помилка при завантаженні файлу')
      return null
    }

    const blob = await fileResponse.blob() // Завантаження файлу як blob
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error)
    return null // Обработка ошибок
  }
}

//component
export const ProfileComponent: FC<Readonly<IProfile>> = () => {
  const router = useRouter() // Используем useRouter для навигации
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const { activeChallengeTypeButton, isAvatarModalActive, handleChangeCommonStore } =
    useCommonStore((state) => ({
      activeChallengeTypeButton: state.activeChallengeTypeButton,
      isAvatarModalActive: state.isModalActive,
      handleChangeCommonStore: state.handleChangeCommonStore,
    }))
  const { t } = useTranslation()
  const { user } = useUserStore()
  const handleSignOut = () => {
    handleChangeUserStore({ user: null })
    router.push('/')
  }
  const handleAvatarClick = () => {
    handleChangeCommonStore({ isModalActive: true })
  }
  const { avatarImage } = useCommonStore((state) => ({
    avatarImage: state.avatarImage,
  }))

  // Загружаем аватарку с сервера при монтировании
  useEffect(() => {
    const loadAvatar = async () => {
      if (user?.access_token) {
        const avatar = await fetchUserAvatar(user.access_token)
        if (avatar) {
          handleChangeCommonStore({ avatarImage: avatar })
        }
      } else {
        console.error('Токен не найден')
      }
    }

    loadAvatar()
  }, [user?.access_token]) // Загружаем аватар при монтировании компонента

  // Функция для возврата на предыдущую страницу
  const handleGoBack = () => {
    router.push('/') // Возвращаемся на предыдущую страницу
  }

  //return
  return (
    <section className={`${styles.profile} container`}>
      <div className={styles.profile__top}>
        {/* Добавляем IconArrow для возврата */}
        <button className={styles.profile__back_btn} onClick={handleGoBack}>
          <IconArrow />
        </button>
        <h1 className={`title`}>{t('profile.myCabinet')}</h1>

        <div className={styles.profile__user}>
          <div className={styles.profile__photo} onClick={handleAvatarClick}>
            <Image
              src={avatarImage ? avatarImage : ImageAvatar.src}
              alt={'name photo'}
              fill
              sizes={'40vw'}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>

          <div className={styles.profile__info}>
            <div>
              <h2 className={styles.profile__name}>{user?.name}</h2>
              <span className={styles.profile__phone}>
                {t('profile.phone')}
                {user?.phone_number}
              </span>
            </div>
            <CoinsDisplayComponent coin={user?.coins} />
          </div>
        </div>

        <ul className={styles.profile__navigation}>
          {PROFILE_LINKS(activeChallengeTypeButton).map((item) => (
            <Link className={styles.profile__navigatation_link} href={item.link} key={item.link}>
              {item.icon} {item.title}
            </Link>
          ))}
        </ul>
        <Link className={`text-4-grey ${styles.profile_privacy}`} href={`/privacy-policy`}>
          {t('profile.privacy')}
        </Link>
      </div>

      <ButtonComponent onClick={handleSignOut}>{t('profile.logout')}</ButtonComponent>
      {isAvatarModalActive && <AvatarComponent />}
    </section>
  )
}

export default ProfileComponent
