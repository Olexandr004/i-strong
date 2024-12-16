import Image from 'next/image'
import { FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ky from 'ky'

import { ImageAvatar } from '@/shared/images'
import { useCommonStore, useUserStore } from '@/shared/stores'

import styles from './avatar-preview.module.scss'

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

// Компонент AvatarPreviewComponent
export const AvatarPreviewComponent: FC = () => {
  const router = useRouter()
  const { avatarImage, handleChangeCommonStore } = useCommonStore((state) => ({
    avatarImage: state.avatarImage,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))
  const { user } = useUserStore()

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
  }, [user?.access_token])

  // Обработчик клика по аватарке
  const handleAvatarClick = () => {
    router.push('/profile')
  }

  return (
    <div className={styles.avatar__container} onClick={handleAvatarClick}>
      <Image
        src={avatarImage ? avatarImage : ImageAvatar.src}
        alt={'user avatar'}
        fill
        sizes={'40vw'}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default AvatarPreviewComponent
