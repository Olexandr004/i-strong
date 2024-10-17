import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FC } from 'react'
import ky from 'ky'

import { ChallengeType } from '@/interfaces/challenge'
import { AvatarComponent } from '@/modules/views/profile/elements'
import { ButtonComponent, CoinsDisplayComponent } from '@/shared/components'
import { IconAnalytic, IconChallenge, IconSetting, IconShop, IconWishList } from '@/shared/icons'
import { ImageAvatar } from '@/shared/images'
import { useCommonStore, useUserStore } from '@/shared/stores'

import styles from './profile.module.scss'

//interface
interface IProfile {}

const PROFILE_LINKS = (activeChallengeTypeButton: ChallengeType) => [
  {
    title: 'Челенджі',
    icon: <IconChallenge />,
    link: `/challenges?path=${activeChallengeTypeButton}`,
  },
  { title: 'Бейджі', icon: <IconShop />, link: '/store' },
  { title: 'Налаштування', icon: <IconSetting />, link: '/settings' },
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
    return response.avatar // Вернёт URL аватара
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error)
    return null // Обработка ошибок
  }
}

//component
export const ProfileComponent: FC<Readonly<IProfile>> = () => {
  const router = useRouter()
  const handleChangeUserStore = useUserStore((state) => state.handleChangeUserStore)
  const { activeChallengeTypeButton, isAvatarModalActive, handleChangeCommonStore } =
    useCommonStore((state) => ({
      activeChallengeTypeButton: state.activeChallengeTypeButton,
      isAvatarModalActive: state.isModalActive,
      handleChangeCommonStore: state.handleChangeCommonStore,
    }))
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

  //return
  return (
    <section className={`${styles.profile} container`}>
      <div className={styles.profile__top}>
        <h1 className={`title`}>Мій кабінет</h1>

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
              <span className={styles.profile__phone}>Тел. +{user?.phone_number}</span>
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
          Політика конфіденційності
        </Link>
      </div>

      <ButtonComponent onClick={handleSignOut}>Вийти</ButtonComponent>
      {isAvatarModalActive && <AvatarComponent />}
    </section>
  )
}
export default ProfileComponent
